import axios from "axios";
import Gbp from "../../models/gbp.model.js";
import Location from "../../models/location.model.js";
import LocationAccess from "../../models/locationAccess.model.js";
import Reviews from "../../models/reviews.model.js";
import User from "../../models/user.model.js";
import UserSubscription from "../../models/userSubscription.model.js";
import { buildReplyPrompt, REPLY_SYSTEM_PROMPT } from "../../utils/gemini/reviewReply.js";
import { getGBPAccounts, getGBPlocationDetails, getGBPLocations, getGBPReviews, transformHours } from "../../utils/Gbp/gbp.js";
import { generateText } from "../../utils/gemini/gemini.js";
import type { ServiceResponse } from "../../types/serviceResponse.js";
import type { PopulatedUser } from "../../types/userTypes.js";



export const getReviewsService=async(userId:string,locationId:string,params:{
  oldestFirst:boolean,rating:number|undefined,pageToken?:string
})=>{
    
  try {
    const location=await Location.findById(locationId);
    
    if(!location){
      return {
        success:false,
        message:"No location found",
        statusCode:404
      }
    }

    if(location.source==="places"){
          return await getAllPlacesApiReviewsService(locationId,params)
    }

    // get valid token (auto refresh if expired)
    const accessToken = await getValidAccessTokenService(userId);
    
    if(!accessToken){
        return {success:false,statusCode:400,message:"no token found"}
    }

    const {totalReviews,nextPageToken,reviews,avgRating} = await getGBPReviews(accessToken, location.gbpLocationId!,location.gbpAccountId!,params.pageToken);
    console.log({rl:reviews.length});
    const starMap:Record<string,number>={
      ONE:1,
      TWO:2,
      THREE:3,
      FOUR:4,
      FIVE:5
    };

  const formattedReviews = {
    totalReviews: totalReviews ?? 0,
    averageRating: avgRating.toFixed(1),
    unrepliedCount: reviews.filter((r: any) => !r.reviewReply).length,
    positiveCount: reviews.filter((r: any) =>
      ["FOUR", "FIVE"].includes(r.starRating)
    ).length,
    negativeCount: reviews.filter((r: any) =>
      ["ONE", "TWO", "THREE"].includes(r.starRating)
    ).length,

    nextPageToken,

    reviews: reviews.map((r: any) => ({
      _id: r.reviewId,
      reviewId: r.reviewId,

      authorName: r.reviewer?.displayName ?? "Anonymous",
      authorUrl: r.reviewer?.profilePhotoUrl ?? "",

      rating: starMap[r.starRating],

      text: r.comment ?? "",

      reviewTime: r.createTime,
      createdAt: r.createTime,
      updatedAt: r.updateTime,
      lastSeenAt: r.updateTime,

      locationId: location.gbpLocationId,

      // Reply data
      replied: !!r.reviewReply,
      replyComment: r.reviewReply?.comment ?? null,
      replyUpdatedAt: r.reviewReply?.updateTime ?? null,
  })),
};
    
    return {
      success: true,
      statusCode:200,
      message:"successfully fetched the account,locations and reviews",
      data:  formattedReviews,
      
    }

  } 
    catch (err:any) {
        console.log({err});
        return {
        success: false,
        statusCode: err.response?.status ?? 500,
        message:
        err.response?.data?.error?.message ??
        "Failed to fetch reviews",
    };
  }
}

export const getAllPlacesApiReviewsService=async (locationId:string,paginationData:{
  oldestFirst:boolean,rating:number|undefined
})=>{
         
    const filter:Record<string,any>={};
    
    filter.locationId=locationId;

    if(paginationData.rating){
        filter.rating=paginationData.rating
    }

    const reviews= await Reviews.find(filter).sort({ reviewTime:paginationData.oldestFirst ? 1 : -1 }).lean()
       
  

    if(!reviews.length){
    return {success:true,statusCode:200,message:"No Reviews Found"}
    }

   const ratings = reviews.map((r) => r.rating ?? 0);

    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

     return {
        success: true,
        statusCode: 200,
        message: "Reviews Fetched Successfully",
        data: {
          totalReviews: reviews.length,
          averageRating: Number(averageRating.toFixed(1)),

          // Places API can't provide reply information
          unrepliedCount: null,
          nextPageToken:null,
          positiveCount: reviews.filter(
            (r) => (r.rating ?? 0) >= 4
          ).length,

          negativeCount: reviews.filter(
            (r) => (r.rating ?? 0) <= 3
          ).length,

          source: "places",

          reviews,
        },
      };
}

export const getlocationsService= async (userId:string)=>{
    try{
        const accessToken = await getValidAccessTokenService(userId);
        
        if(!accessToken){
            return {success:false,statusCode:400,message:"no token found"}
        }
        const accounts =await getGBPAccounts(accessToken);
      
         if (!accounts?.length) {
          return { success: false,statusCode:400,message: "No business accounts found" }
        }
        const locations=[];
    
        for(const account of accounts){
            const locs = await getGBPLocations(accessToken, account.name);
            
            if(!locs || locs.length==0){
              continue
            }

            locations.push(...locs.map((loc:{name:string,title:string})=>({
                ...loc,
                accountId:account.name,
            })));
        }
        if (!locations?.length) {
          return { success: false,statusCode:400,message: "No locations found" }
        }
    
        return {success:true,statusCode:200,message:"locations fetched successfully",data:locations}
    }
    catch(err:any){
      console.log({err})
        if (err.isAxiosError) {
        return {
          success: false,
          statusCode: err.response?.status ?? 500,
          message: err.response?.data?.error?.message ?? "Failed to fetch location details from Google"
        }
      }
      return {
          success: false,
          statusCode: err?.status ?? 500,
          message: err
        }
    }
} 

export const getGbpConnectionService=async(userId:string)=>{
    const gbp=await Gbp.findOne({userId}).select("connected");


    return {success:true,statusCode:200 ,message:"successfully fetched the connection",data:{
      connected:gbp?.connected?true:false
    }}
}

// export const updateGBPConnectionService=async(userId:string)=>{

//    await Gbp.findOneAndUpdate({
//     userId
//    },{
//      connected:false
//    });

//    return {
//       success:true,
//       statusCode:200,
//       message:"Successfully updated Gbp"
//    }
// }

export const confirmGbpLocationsService = async (
  userId: string,
  location: { locationId: string; title: string; accountId: string; connectionId: string }
) => {
  if (!location) {
    return { success: false, statusCode: 400, message: "No location provided" };
  }

  const STAR_MAP: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

  try {
    const accessToken = await getValidAccessTokenService(userId);
    if (!accessToken) {
      return { success: false, statusCode: 400, message: "No token found" };
    }

    // Fetch location details and reviews in parallel
    const [locationDetails, {reviews,totalReviews,avgRating}] = await Promise.all([
      getGBPlocationDetails(accessToken, location.locationId, location.accountId),
      getGBPReviews(accessToken, location.locationId, location.accountId),
    ]);
    
    const alreadyExisting = await Location.findOne({
      placeId: locationDetails.metadata.placeId,
      createdBy:userId,
      isDeleted: false,
    });

    if (alreadyExisting) {
      return {
        success: false,
        statusCode: 409,
        message: `${alreadyExisting.name} already exists`,
        data: alreadyExisting,
      };
    }


    const createdLocation = await Location.create({
      totalReviews: totalReviews ?? 0,
      rating: avgRating.toFixed(1),
      gbpLocationId: locationDetails.name,
      gbpAccountId: locationDetails.accountId,
      createdBy: userId,
      name: locationDetails.title,
      address: locationDetails.storefrontAddress.addressLines.join(", "),
      coordinates: {
        lat: locationDetails.latlng.latitude,
        lng: locationDetails.latlng.longitude,
      },
      source: "gbp",
      website: locationDetails.websiteUri,
      placeId: locationDetails.metadata.placeId,
      reviewLink: locationDetails.metadata.newReviewUri,
      opening_hours: {
        schedule: transformHours(locationDetails.regularHours),
      },
      types: locationDetails.categories?.primaryCategory?.serviceTypes?.map(
        (s: any) => s.displayName.toLowerCase()
      ) ?? [],
    })

    const formattedReviews = reviews.map((r: any) => ({
      reviewId: r.reviewId,
      authorName: r.reviewer?.displayName ?? "Anonymous",
      authorUrl: r.reviewer?.profilePhotoUrl ?? "",
      rating: STAR_MAP[r.starRating],
      text: r.comment ?? "",
      reviewTime: r.createTime,
      createdAt: r.createTime,
      updatedAt: r.updateTime,
      lastSeenAt: r.updateTime,
      locationId: createdLocation._id,
    }));

    // Save everything in parallel
    await Promise.all([
      Reviews.insertMany(formattedReviews),
      LocationAccess.create({
        userId,
        locationId: createdLocation._id,
        isDeleted: false,
        addedBy: userId,
      }),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: "Successfully added the location",
    };

  } catch (err: any) {
      
     if (err.isAxiosError) {
        return {
          success: false,
          statusCode: err.response?.status ?? 500,
          message: err.response?.data?.error?.message ?? "Failed to fetch location details from Google"
        }
      }
      const validationMessage = err.errors
      ? Object.values(err.errors).map((e: any) => e.message).join(", ")
      : err.message ?? "Internal server error";

      return { success: false, statusCode: err?.status ?? 500, message: validationMessage };
    }
  }
    
  


export const getValidAccessTokenService = async (userId:string) => {
  console.log({userId})
const gbp = await Gbp.findOne({userId});

  if (!gbp) {
    throw new Error("GBP not connected");
  }

  try {
    await axios.get(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${gbp.accessToken}`,
        },
      }
    );

    return gbp.accessToken;
  } catch (err: any) {
    if (err.response?.status === 401) {
      console.log("Access token expired, refreshing...");

      const newAccessToken = await refreshAccessTokenService(
        gbp.refreshToken!
      );
       
      await Gbp.findByIdAndUpdate(gbp._id, {
        accessToken: newAccessToken,
      });

      return newAccessToken;
    }
    throw err;
  }
};

export const refreshAccessTokenService = async (refreshToken: string):Promise<string> => {
    try{
        
       const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      });

        const res = await axios.post(
        "https://oauth2.googleapis.com/token",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
        return res.data.access_token;
    }
    catch(err){
        throw err
    }
}

export const linkLocationWithGBPService = async (
  accessToken: string,
  locationId: string
): Promise<boolean> => {
  const existingLocation = await Location.findById(locationId);
  console.log({existingLocation})
  if (!existingLocation?.placeId) {
    return false;
  }

  const accounts = await getGBPAccounts(accessToken);
  if (!accounts?.length) {
    return false;
  }

  for (const account of accounts) {
    const locations = await getGBPLocations(
      accessToken,
      account.name
    );
    if (!locations?.length) {
      continue;
    }

    const matchedLocation = locations.find(
      (loc: any) =>
        loc.metadata?.placeId === existingLocation.placeId
    );
   
    if (matchedLocation) {
      await Location.findByIdAndUpdate(
        existingLocation._id,
        {
          source: "gbp",
          gbpLocationId: matchedLocation.name,
          gbpAccountId: account.name,
        }
      );

      return true;
    }
  }

  return false;
};



export const generateReviewReplyService = async (
  userId:     string,
  locationId: string,
  reviewText: string,
  rating:     number,
  authorName: string,
  hint?:      string
): Promise<ServiceResponse> => {

  const location = await Location.findById(locationId).lean();
  if (!location) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  const prompt = buildReplyPrompt(
    reviewText,
    rating,
    authorName,
    (location as any).name    ?? "",
    (location as any).types?.join(", ") ?? "",
    hint
  );

  const reply = await generateText(prompt, REPLY_SYSTEM_PROMPT);

  return {
    success:    true,
    statusCode: 200,
    message:    "Reply generated",
    data:       { reply: reply.trim() },
  };
};


export const postReviewReplyService = async (
  userId:     string,
  locationId: string,
  reviewId:   string, // short GBP reviewId e.g. "AbFvOqnLRrf..."
  reply:      string
): Promise<ServiceResponse> => {

  // ── check aiReplies limit ─────────────────────────────────────────────────
  const user = await User.findById(userId)
    .populate("activeSubscription") as PopulatedUser | null;

  if (!user?.activeSubscription) {
    return { success: false, statusCode: 404, message: "No active subscription" };
  }

  const now          = new Date();
  const currentCycle = user.activeSubscription.cycles.find(
    (c) => now >= c.startDate && now <= c.endDate
  );

  if (!currentCycle) {
    return { success: false, statusCode: 404, message: "No active billing cycle found" };
  }

  const repliesUsed  = currentCycle.aiReplies?.creditsUsed  ?? 0;
  const repliesTotal = currentCycle.aiReplies?.creditsTotal ?? null;

  if (repliesTotal !== null && repliesUsed >= repliesTotal) {
    return { success: false, statusCode: 403, message: "AI reply credits exhausted. Upgrade your plan." };
  }

  // ── get location + access token ───────────────────────────────────────────
  const location = await Location.findById(locationId).lean();
  if (!location) {
    return { success: false, statusCode: 404, message: "Location not found" };
  }

  const accessToken = await getValidAccessTokenService(userId);
  if (!accessToken) {
    return { success: false, statusCode: 401, message: "GBP not connected" };
  }

  // ── build full GBP review name from parts ─────────────────────────────────
  const accountId  = (location as any).gbpAccountId  ?? "";
  const gbpLocId   = (location as any).gbpLocationId ?? "";

  const numericAccountId  = accountId.match(/(\d+)$/)?.[1]  ?? accountId;
  const numericLocationId = gbpLocId.match(/(\d+)$/)?.[1]   ?? gbpLocId;

  const reviewName = `accounts/${numericAccountId}/locations/${numericLocationId}/reviews/${reviewId}`;

  // ── post reply to GBP API ─────────────────────────────────────────────────
  await axios.put(
    `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
    { comment: reply },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  // ── decrement aiReplies ───────────────────────────────────────────────────
  await UserSubscription.findOneAndUpdate(
    {
      _id:    user.activeSubscription._id,
      cycles: {
        $elemMatch: {
          startDate: { $lte: now },
          endDate:   { $gt:  now },
        },
      },
    },
    { $inc: { "cycles.$.aiReplies.creditsUsed": 1 } }
  );

  return {
    success:    true,
    statusCode: 200,
    message:    "Reply posted successfully",
    data:       { reply },
  };
};