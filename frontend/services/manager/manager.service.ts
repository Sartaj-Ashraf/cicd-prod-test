import customFetch from "@/utils/customFetch";
import { handleError } from "@/utils/service/serviceUtil";


export const inviteManagerApi = async (payload: {
  email: string;
  name: string;
  locationId: string;
}) => {
  try {
    const res = await customFetch.post("/manager/invite", payload);
    return res.data;
  } catch (error) {
    handleError(error, true);
  }
};

export const resendInviteApi = async (id: string) => {
  try {
    const res = await customFetch.post(`/manager/${id}/resend`);
    return res.data;
  } catch (error) {
    handleError(error, true);
  }
};

export const getManagersByLocationApi = async (locationId: string) => {
  const res = await customFetch.get(`/manager/location/${locationId}`);
  return res.data;
};

export const deleteManagerApi = async (id: string) => {
  const res = await customFetch.delete(`/manager/${id}`);
  return res.data;
};

export const acceptInviteApi = async (token: string) => {
  const res = await customFetch.post(`/manager/accept/${token}`);
  return res.data;
};