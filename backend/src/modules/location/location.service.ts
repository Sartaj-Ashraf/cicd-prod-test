import Gbp from "../../models/gbp.model.js";
import Location       from "../../models/location.model.js";
import LocationAccess from "../../models/locationAccess.model.js";
import Reviews from "../../models/reviews.model.js";
import User from "../../models/user.model.js";
import type { ReviewType } from "../../types/reviewType.js";
import type { ServiceResponse } from "../../types/serviceResponse.js";
import generateReviewId from "../../utils/generateReviewId.js";
import { resolveUrl, extractDataFromUrl, resolvePlaceId, fetchPlaceDetails, extractPlaceIdFromUrl } from "../../utils/location/location.js";
import { generateText } from "../../utils/gemini/gemini.js";
import ParseWeekDayText from "../../utils/parseWeekDayText.js";
import mongoose, { MongooseError } from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safeParseJson, buildPrompt ,getRatingAnalysis,getReviewAnalysis,getOnlinePresenceAnalysis,getOverallScoreAnalysis,calculateOnlinePresenceScore,calculateRatingScore,calculateReviewScore,calculateOverallScore,normalizeBusiness } from "../../utils/competitor-analysis/competitor-analysis-functions.js";
import axios from "axios";
export const extractLocationService = async (
  url: string
): Promise<ServiceResponse> => {
  try {
    const resolvedUrl = await resolveUrl(url);

    //  THIS IS THE EXACT PLACE YOU MODIFY
    let placeId = extractPlaceIdFromUrl(resolvedUrl);

    if (placeId && !placeId.startsWith("ChIJ")) {
      placeId = null;
    }

    if (!placeId) {
      const extracted = extractDataFromUrl(resolvedUrl);
      placeId = await resolvePlaceId(extracted);
    }

    if (!placeId) {
      return {
        success: false,
        statusCode: 400,
        message: "Could not determine place",
      };
    }

    const place = await fetchPlaceDetails(placeId);
    if (!place) {
      return {
        success: false,
        statusCode: 404,
        message: "Place not found on Google Maps",
      };
    }
const photoRef = place.photos?.[0]?.photo_reference;
// console.log({place , photoRef})

    const image = photoRef
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.GOOGLE_PLACES_API_KEY}`
      : null;

    let schedule;
    if (place?.opening_hours) {
      schedule = ParseWeekDayText(place.opening_hours?.weekday_text)
    }


    return {
      success: true,
      statusCode: 200,
      message: "Place resolved successfully",
      data: {
        placeId,
        name: place?.name,
        address: place?.formatted_address,
        opening_hours: {
          open_now: place?.opening_hours?.open_now,
          schedule
        },
        coordinates: {
          lat: place?.geometry?.location?.lat ?? null,
          lng: place?.geometry?.location?.lng ?? null,
        },
        rating: place?.rating ?? null,
        totalReviews: place?.user_ratings_total ?? null,
        types: place?.types ?? [],
        image,
        reviewLink: `https://search.google.com/local/writereview?placeid=${place?.place_id}`,
        website: place?.website,
        reviews: place?.reviews?.length ? place.reviews : []
      },
    };
  } catch (err: any) {
    return {
      success: false,
      statusCode: 500,
      message: err?.message || "Failed to extract location",
    };
  }
};

export const confirmLocationService = async (
  userId: string,
  data: {
    placeId: string;
    name: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    rating?: number;
    totalReviews?: number;
    nickname?: string;
    opening_hours: {
      open_now: boolean,
      schedule:
      {
        day: string,
        opening: string,
        closing: string
      }[]

    };
    image: string,
    types: string[],
    website: string,
    reviews: ReviewType[]
  }
): Promise<ServiceResponse> => {

  const { reviews = [], ...locationData } = data
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const [location] = await Location.create([{
      ...locationData,
      createdBy: userId,
      source: "places",
      reviewLink: `https://search.google.com/local/writereview?placeid=${data.placeId}`,
    }], { session });

    //upload Reviews
    const operations = reviews.map((r: ReviewType) => {
      return {
        insertOne: {
          document: {
            locationId: location!._id,
            authorName: r.author_name,
            authorUrl: r.author_url,
            reviewId: generateReviewId(r.author_name, r.time),
            rating: r.rating,
            text: r.text,
            reviewTime: new Date(r.time * 1000),
            lastSeenAt: new Date()
          }
        }
      }
    })
    await Reviews.bulkWrite(operations, { session })

    // create LocationAccess for admin
    await LocationAccess.create([{
      userId: userId,
      locationId: location!._id,
      role: "admin",
      addedBy: userId,
    }], { session });
    await session.commitTransaction();

    return {
      success: true,
      statusCode: 201,
      message: "Location saved successfully",
      data: location,
    };

  }
  catch (err: any) {
    await session.abortTransaction();
    if (err.code === 11000) {
      // console.log(err)
      return {
        success: false,
        statusCode: 409,
        message: "Location already exists",
      };
    }

    throw err;
  }
  finally {
    await session.endSession();
  }
};

export const getMyLocationsService = async (userId: string): Promise<ServiceResponse> => {
  const accesses = await LocationAccess.findOne({
    userId: userId,
    isDeleted: false,
  }).populate({
    path: "locationId",
    match: { isDeleted: false },
    select: "_id nickname opening_hours name address rating totalReviews placeId types website createdBy badReviewRedirect", 
});
   
  return {
    success: true,
    statusCode: 200,
    message: "Locations fetched",
    data: accesses?.locationId ?? null,
  };
};


export const getLocationByIdService = async (
  userId: string,
  locationId: string
): Promise<ServiceResponse> => {

  const access = await LocationAccess.findOne({
    userId,
    locationId,
    isDeleted: false,
  }).populate("locationId");

  if (!access) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  return {
    success: true,
    statusCode: 200,
    message: "Location found",
    data: access.locationId,
  };
};


export const updateLocationService = async (
  userId: string,
  locationId: string,
  data: { nickname?: string; isActive?: boolean }
): Promise<ServiceResponse> => {

  // only admin who created can update
  const location = await Location.findOne({
    _id: locationId,
    createdBy: userId,
    isDeleted: false,
  });

  if (!location) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  const updated = await Location.findByIdAndUpdate(locationId, data, { new: true });

  return {
    success: true,
    statusCode: 200,
    message: "Location updated",
    data: updated,
  };
};


export const deleteLocationService = async (
  userId: string,
  locationId: string
): Promise<ServiceResponse> => {

    const deletedLocation = await Location.findOneAndDelete({
        _id: locationId,
        createdBy: userId,
        isDeleted: false,
      });

    if (!deletedLocation) {
      return {
        success: false,
        statusCode: 404,
        message: "Location not found",
      };
    }
  
    const [reviewsResult, accessResult] = await Promise.all([
  
      Reviews.deleteMany(
        {
          locationId,
        }
      ),
  
      LocationAccess.deleteMany(
        {
          locationId,
        }
      ),

      Gbp.findOneAndUpdate({
        userId
      },{
        connected:false
      })
    ]);
    
   
  
    return {
      success: true,
      statusCode: 200,
      message: "Location deleted successfully",
      data: {
        deletedLocation,
        DeletedReviews: reviewsResult.deletedCount,
        DeletedAccessRecords: accessResult.deletedCount,
      },
  }; 
}



export const toggleBadReviewRedirectGlobalService = async (
  userId: string,
  enabled: boolean
): Promise<ServiceResponse> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $set: { badReviewRedirectEnabled: enabled },
    });
    return {
      success: true,
      statusCode: 200,
      message: `Bad review redirect ${enabled ? "enabled" : "disabled"} globally`,
    };
  } catch (err: any) {
    return {
      success: false,
      statusCode: 500,
      message: err?.message ?? "Failed to update setting",
    };
  }
};

export const toggleBadReviewRedirectLocationService = async (
  userId: string,
  locationId: string,
  enabled: boolean
): Promise<ServiceResponse> => {
  try {
    const location = await Location.findOne({
      _id: locationId,
      createdBy: userId,
      isDeleted: false,
    });
    if (!location) {
      return { success: false, statusCode: 404, message: "Location not found" };
    }

    await Location.findByIdAndUpdate(locationId, {
      $set: { "badReviewRedirect.enabled": enabled },
    });

    return {
      success: true,
      statusCode: 200,
      message: `Bad review redirect ${enabled ? "enabled" : "disabled"} for this location`,
    };
  } catch (err: any) {
    return {
      success: false,
      statusCode: 500,
      message: err?.message ?? "Failed to update setting",
    };
  }
};

const PLACES_TIMEOUT_MS = 8_000;
const GEMINI_TIMEOUT_MS = 20_000;


// ─────────────────────────────────────────────────────────────
// Main Service
// ─────────────────────────────────────────────────────────────
export const getCompetitorAnalysisService = async (
  myPlaceId: string,
  competitorsData: any
): Promise<ServiceResponse> => {
  try {
    console.log(myPlaceId)
    // ── Normalise competitors input ──────────────────────────────────────
    const competitors: any[] = Array.isArray(competitorsData)
      ? competitorsData
      : competitorsData?.competitors ??
        competitorsData?.data ??
        competitorsData?.results ??
        (competitorsData ? [competitorsData] : []);

    if (competitors.length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "No competitor data provided",
      };
    }

    // ── Fetch only myBusiness from Places API (competitors already sent by frontend) ──
    const placesRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: myPlaceId,
          fields:
            "name,formatted_address,rating,user_ratings_total,reviews,types,website,opening_hours/weekday_text,photos",
          key: process.env.GOOGLE_PLACES_API_KEY,
          reviewsSort: "newest",
        },
        timeout: PLACES_TIMEOUT_MS,
      }
    );
console.log(placesRes,"placeres")
    // ── Build myBusiness from Places API response ────────────────────────
    const raw = placesRes.data.result;
    const myBusinessRaw = {
      name: raw.name,
      formatted_address: raw.formatted_address,
      rating: raw.rating ?? 0,
      user_ratings_total: raw.user_ratings_total ?? 0,
      types: raw.types ?? [],
      website: raw.website ?? null,
      photos: raw.photos ?? [],
      opening_hours: raw.opening_hours ?? null,
      reviews: (raw.reviews ?? []).slice(0, 3).map((r: any) => ({
        rating: r.rating,
        text: r.text?.slice(0, 200) ?? "",
      })),
    };

    const myBusinessNorm = normalizeBusiness(myBusinessRaw);
console.log(myBusinessNorm,"my business norm")
    // ── Calculate my business scores ─────────────────────────────────────
    const myScores = {
      ratingScore: calculateRatingScore(myBusinessNorm.rating),
      reviewScore: calculateReviewScore(myBusinessNorm.totalReviews),
      onlinePresenceScore: calculateOnlinePresenceScore(myBusinessNorm),
      overallScore: 0,
    };
    myScores.overallScore = calculateOverallScore(
      myScores.ratingScore,
      myScores.reviewScore,
      myScores.onlinePresenceScore
    );

    // ── Process ALL competitors from frontend payload ─────────────────────
    const competitorsPayload = competitors.map((compRaw: any) => {
      // normalizeBusiness must handle the shape your frontend sends
      const competitorNorm = normalizeBusiness(compRaw ?? {});

      const competitorScores = {
        ratingScore: calculateRatingScore(competitorNorm.rating),
        reviewScore: calculateReviewScore(competitorNorm.totalReviews),
        onlinePresenceScore: calculateOnlinePresenceScore(competitorNorm),
        overallScore: 0,
      };
      competitorScores.overallScore = calculateOverallScore(
        competitorScores.ratingScore,
        competitorScores.reviewScore,
        competitorScores.onlinePresenceScore
      );

      const ratingAnalysis = getRatingAnalysis(
        myBusinessNorm.rating,
        competitorNorm.rating
      );
      const reviewAnalysis = getReviewAnalysis(
        myBusinessNorm.totalReviews,
        competitorNorm.totalReviews
      );
      const onlinePresenceAnalysis = getOnlinePresenceAnalysis(
        myBusinessNorm,
        competitorNorm
      );
      const overallAnalysis = getOverallScoreAnalysis(
        myBusinessNorm,
        competitorNorm
      );

      return {
        name: competitorNorm.name,
        rating: competitorNorm.rating,
        totalReviews: competitorNorm.totalReviews,
        types: competitorNorm.types,
        website: competitorNorm.website,
        openingHours: competitorNorm.openingHours,
        // Reviews come directly from the normalized competitor — no index lookup needed
        reviews: competitorNorm.reviews ?? [],
        scores: competitorScores,
        comparisons: {
          rating: ratingAnalysis,
          reviews: reviewAnalysis,
          onlinePresence: onlinePresenceAnalysis,
          overall: overallAnalysis,
        },
      };
    });

    // ── Build prompt context ─────────────────────────────────────────────
    const preComputedContext = {
      myBusiness: {
        name: myBusinessNorm.name,
        rating: myBusinessNorm.rating,
        totalReviews: myBusinessNorm.totalReviews,
        types: myBusinessNorm.types,
        website: myBusinessNorm.website,
        openingHours: myBusinessNorm.openingHours,
        reviews: myBusinessNorm.reviews,
        scores: myScores,
      },
      competitors: competitorsPayload,
    };

    // ── Gemini with hard timeout ─────────────────────────────────────────

const timeoutPromise = new Promise<never>((_, reject) =>
  setTimeout(
    () => reject(new Error("Gemini request timed out")),
    GEMINI_TIMEOUT_MS
  )
);

const response = await Promise.race([
  generateText(buildPrompt(preComputedContext)),
  timeoutPromise,
]);

const analysis = safeParseJson(response as string);
    return {
      success: true,
      statusCode: 200,
      message: "Competitor analysis retrieved successfully",
      data: {
        myPlaceId,
        // myBusinessNorm:myBusinessNorm,
        scores: myScores,
        competitors: competitorsPayload.map((c) => ({
          name: c.name,
          scores: c.scores,
          totalReviews: c.totalReviews,   // ← add this
          rating: c.rating, 
          comparisons: c.comparisons,
        })),
        analysis,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      statusCode: 500,
      message: err?.message ?? "Failed to retrieve competitor analysis",
    };
  }
};
