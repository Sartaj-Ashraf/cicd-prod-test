// reviewHooks.ts
import { useQuery } from "@tanstack/react-query";
// reviewApi.ts
import customFetch from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";


// GET ALL REVIEWS
const getReviews = async (
  locationId: string,
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    oldestFirst?: boolean;
    pageToken?:string
  }
) => {
  try {
    const res = await customFetch.get(
      `google/reviews/${locationId}`,
      {
        params,
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
// GET ALL REVIEWS
export const useReviews = (
  locationId: string,
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    oldestFirst?: boolean;
    pageToken?:string
  }
) => {
  return useQuery({
    queryKey: ["reviews", locationId, params],
    queryFn: () => getReviews(locationId, params),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10,   // 10 minutes
  });
};


export const generateReply = async (
  locationId: string,
  reviewText: string,
  rating:     number,
  authorName: string,
  hint?:      string
): Promise<string> => {
try {
    const res = await customFetch.post("google/reviews/generate-reply", {
    locationId,
    reviewText,
    rating,
    authorName,
    hint,
  });
  return res.data.data.reply as string;
} catch (error) {
  handleError (error,true)
  throw error;
}
};

export const postReply = async (
  locationId: string,
  reviewId:   string,
  reply:      string
): Promise<void> => {
try {
    await customFetch.put("google/reviews/reply", {
    locationId,
    reviewId,
    reply,
  });
} catch (error) {
  handleError (error,true)
  throw error;
}
};
