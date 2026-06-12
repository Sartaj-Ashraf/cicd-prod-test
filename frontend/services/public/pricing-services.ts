import customFetch from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";


export const getActivePricing = async () => {
  try {
    const res = await customFetch.get("/pricing/active");
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPricingById = async (id: string) => {
  try {
    const res = await customFetch.get(`/pricing/${id}`);
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};

