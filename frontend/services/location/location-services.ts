import customFetch from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";

export const extractLocation = async (url: string) => {
  try {
    const res = await customFetch.post("/location/extract", { url });
    return res.data.data;
  } catch (error) {
    handleError(error, true);
  }
};

export const confirmLocation = async (data: {
  placeId: string;
  name: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  rating?: number;
  totalReviews?: number;
  nickname?: string;
  opening_hours:{
        open_now:boolean,
        schedule:
            {
                day:string,
                opening:string,
                closing:string
            }[]
        
     };
     photos:{
           photo_reference: string,
     
         width: number,
         height: number,
     
         html_attributions: string[],
        }[]
      ,
      types:string[],
      
      website:string,
}) => {
  try {
    const res = await customFetch.post("/location/confirm", data);
    return res.data.data;
  } catch (error) {
    handleError(error, true);
  }
};

export const confirmGbpLocation=async(locations:{
  locationId:string,
  accountId:string,
  title:string
})=>{
     try {
    const res = await customFetch.post("/google/confirm-gbp-location", {locations});
    return res.data.data;
  } catch (error) {
    handleError(error, true);
  }
}

export const getMyLocations = async () => {
  try {
    const res = await customFetch.get("/location");
    if(!res.data.data){
      return null
    }
    return res.data.data;
  } catch (error) {
    handleError(error, false);
  }
};

  export const getGbpConnection = async () => {
    try {
      const res = await customFetch.get("/google/check-connection");
      return res.data.data;
    } catch (error) {
      handleError(error, false);
    }
  };

export const getLocationById = async (id: string) => {
  try {
    const res = await customFetch.get(`/location/${id}`);
    return res.data.data;
  } catch (error) {
    handleError(error, false);
  }
};

export const updateLocation = async ({
  id,
  data,
}: {
  id: string;
  data: {
    nickname?: string;
    isActive?: boolean;
  };
}) => {
  try {
    const res = await customFetch.patch(`/location/${id}`, data);
    return res.data.data;
  } catch (error) {
    handleError(error, true);
  }
};

export const deleteLocation = async (id: string) => {
  try {
    const res = await customFetch.delete(`/location/${id}`);
    return res.data.data;
  } catch (error) {
    handleError(error, true);
  }
};
export const toggleBadReviewRedirectGlobal = async (enabled: boolean) => {
  try {
    const res = await customFetch.patch("/location/bad-review-redirect/global", { enabled });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const toggleBadReviewRedirectLocation = async (
  locationId: string,
  enabled:    boolean
) => {
  try {
    const res = await customFetch.patch(`/location/${locationId}/bad-review-redirect`, { enabled });
    return res.data;
  } catch (error) {
    handleError(error);
  }
};


export const getFeedbackByLocation = async (
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
  try {
    const res = await customFetch.get(`/feedback/${locationId}`, { params });
    return res.data.data;
  } catch (error) {
    handleError(error);
  }
};