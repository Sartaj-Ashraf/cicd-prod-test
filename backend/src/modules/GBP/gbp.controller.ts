import type { Request,Response } from "express"
import { confirmGbpLocationsService, generateReviewReplyService, getGbpConnectionService, getlocationsService, getReviewsService, postReviewReplyService } from "./gbp.service.js"
import sendResponse from "../../utils/response.js";

export const getReviews = async (req: Request, res: Response) => {
  const result = await getReviewsService(
    req.user?.userId!,
    req.params.locationId as string,
    {
      rating: req.query.rating
        ? Number(req.query.rating)
        : undefined,
      oldestFirst: req.query.oldestFirst === "true",
      ...(req.query.pageToken && { pageToken: req.query.pageToken as string }),
    }
  );

  return sendResponse(res, result);
};

export const getLocations=async(req:Request,res:Response)=>{
      const result=await getlocationsService(req.user?.userId!);
      return sendResponse(res,result)
}
export const checkGbpConnection=async (req:Request,res:Response)=>{
   const result=await getGbpConnectionService(req.user?.userId!);
   return sendResponse(res,result);
}

export const confirmGbpLocations=async (req:Request,res:Response)=>{
    const result=await confirmGbpLocationsService(req.user?.userId!,req.body.locations);
    return sendResponse(res,result);
}

// export const updateGbpConnection=async(req:Request,res:Response)=>{
//     const result=await updateGBPConnectionService(req.user?.userId!);
//     return sendResponse(res,result);
// }

export const generateReviewReply = async (req: Request, res: Response) => {
  const result = await generateReviewReplyService(
    req.user?.userId!,
    req.body.locationId,
    req.body.reviewText,
    req.body.rating,
    req.body.authorName,
    req.body.hint
  );
  return sendResponse(res, result);
};

export const postReviewReply = async (req: Request, res: Response) => {
  const result = await postReviewReplyService(
    req.user?.userId!,
    req.body.locationId,
    req.body.reviewId,   
    req.body.reply
  );
  return sendResponse(res, result);
};
