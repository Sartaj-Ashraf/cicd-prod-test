import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getLocationForFeedback,
  getPublicQuestions,
  submitFeedback,
  resetBadReviewCount,
} from "@/services/public/feedback-services";
import { getFeedbackByLocation } from "@/services/location/location-services";
import { recordScan } from "@/services/feedbacks/feedback.service";

export const useLocationForFeedback = (
  placeId:   string | null,
  createdBy: string | null
) => {
  return useQuery({
    queryKey:  ["feedback-location", placeId, createdBy],
    queryFn:   () => getLocationForFeedback(placeId!, createdBy!),
    enabled:   !!placeId && !!createdBy,
    retry:     false,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicQuestions = (businessId: string | null) => {
  return useQuery({
    queryKey:  ["public-questions", businessId],
    queryFn:   () => getPublicQuestions(businessId!),
    enabled:   !!businessId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: ({
      locationId,
      data,
    }: {
      locationId: string;
      data: {
        rating:     number;
        answers?:   any[];
        comment?:   string;
        createdBy?: string; 
        fullName?:      string;
        phoneNumber?:     string;
      };
    }) => submitFeedback(locationId, data),
  });
};

export const useResetBadReviewCount = () => {
  return useMutation({
    mutationFn: (locationId: string) => resetBadReviewCount(locationId),
  });
};

export const useGetFeedbackByLocation = (
  locationId: string,
  params: {
    page?:      number;
    limit?:     number;
    rating?:    number;
    startDate?: string;
    endDate?:   string;
    sort?:      string;
  }
) => {
  return useQuery({
    queryKey:  ["feedback", locationId, params],
    queryFn:   () => getFeedbackByLocation(locationId, params),
    enabled:   !!locationId,
    staleTime: 2 * 60 * 1000,
  });
};  
export const useRecordScan = () => {
  return useMutation({
    mutationFn: ({
      locationId,
      createdBy,
      isRegenerate = false,
      chips
    }: {
      locationId:   string;
      createdBy:    string;
      isRegenerate?: boolean;
      chips:string[]
    }) => recordScan(locationId, createdBy, isRegenerate,chips),
  });
};
