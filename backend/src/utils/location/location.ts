import axios from "axios";


export const resolveUrl = async (url: string): Promise<string> => {
  try {
    const res = await axios.get(url, {
      maxRedirects: 10,
      validateStatus: () => true,
    });

    return (
      res.request?.res?.responseUrl ??
      res.request?.responseURL ??
      res.config?.url ??
      url
    );
  } catch {
    return url;
  }
};

export const extractPlaceIdFromUrl = (url: string): string | null => {
  const patterns = [
    /!1s([^!]+)/,          // ✅ BEST (real placeId)
    /place_id=([^&]+)/,    // fallback
  ];

  for (const pattern of patterns) {
    const match = url?.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

export const extractDataFromUrl = (url: string) => {
  const latLngMatch = url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  const nameMatch = url?.match(/\/place\/([^/]+)/);

  const lat = latLngMatch?.[1];
  const lng = latLngMatch?.[2];
  const name = nameMatch?.[1];

  return {
    lat: lat ? parseFloat(lat) : null,
    lng: lng ? parseFloat(lng) : null,
    name: name
      ? decodeURIComponent(name.replace(/\+/g, " "))
      : null,
  };
};


export const resolvePlaceId = async (data: any): Promise<string | null> => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY missing");

  // ❗ ONLY fallback logic here

  // 1. lat/lng + name → TEXT SEARCH (better than nearby)
  if (data?.name && data?.lat && data?.lng) {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          query: data.name,
          location: `${data.lat},${data.lng}`,
          radius: 500,
          key: apiKey,
        },
      }
    );

    if (res.data.results?.length) {
      return res.data.results[0].place_id;
    }
  }

  // 2. name only
  if (data?.name) {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
      {
        params: {
          input: data?.name,
          inputtype: "textquery",
          fields: "place_id",
          key: apiKey,
        },
      }
    );

    if (res.data.candidates?.length) {
      return res.data.candidates[0].place_id;
    }
  }

  return null;
};


export const fetchPlaceDetails = async (placeId: string) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const res = await axios.get(
    "https://maps.googleapis.com/maps/api/place/details/json",
    {
      params: {
        place_id: placeId,
        fields:
          "name,formatted_address,geometry,rating,user_ratings_total,photos,reviews,types,website,opening_hours/weekday_text",
        key: apiKey,
          reviewsSort: "newest"
      },
    }
  );

  if (res.data.status !== "OK") return null;

  return res.data.result;
};