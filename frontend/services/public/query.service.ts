import { querySchemaType } from "@/app/(public)/contact-us/query.schema";
import customFetch from "@/utils/customFetch"
import { handleError } from "@/utils/service/serviceUtil";

export const sendFormQuery = async (data: querySchemaType) => {
  try {
    const response = await customFetch.post("/query", data);
    console.log(response);
    return response.data;
  } catch (error) {
          handleError(error);
      
    }
}
