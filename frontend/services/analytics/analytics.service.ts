import customFetch from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";

export const getAnalyticsData = async (placeId: string, locationId: string) => {
    try{
    
        const response = await customFetch.get(`/analytics/analyze?placeId=${placeId}&locationId=${locationId}`);
        return response.data;
    }

    catch(err){
        handleError(err ,true);
    }
};
export const getAnalytics=async(locationId:string)=>{
  const res=await customFetch.get(`/analytics/${locationId}`);
        return res.data.data
}