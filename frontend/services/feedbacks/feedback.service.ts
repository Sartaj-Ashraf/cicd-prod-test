// services/public/feedback-services.ts
import customFetch    from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";

export const getLocationForFeedback = async (
  placeId:   string,
  createdBy: string
) => {
  try {
    const res = await customFetch.get("/feedback/location", {
      params: { placeId, createdBy },
    });
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPublicQuestions = async (businessId: string) => {
  try {
    const res = await customFetch.get(`/questions/public/${businessId}`);
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const submitFeedback = async (
  locationId: string,
  data: {
    rating:   number;
    answers?: { questionText: string; questionType: string; value: unknown }[];
    comment?: string;
  }
) => {
  try {
    const res = await customFetch.post(`/feedback/${locationId}`, data);
    return res.data;
  } catch (error) {
    handleError(error ,false);
  }
};

export const resetBadReviewCount = async (locationId: string) => {
  try {
    const res = await customFetch.post(`/feedback/${locationId}/reset-bad-review`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const recordScan = async (
  locationId:   string,
  createdBy:    string,
  isRegenerate: boolean = false,
  chips:        string[]
) => {
  try {
    const res = await customFetch.post(
      `/feedback/${locationId}/record-scan`,
      { createdBy, isRegenerate,chips }
    );
    return res.data.data;
  } catch (error) {
    handleError(error, false);
  }
};