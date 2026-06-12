import type { Request, Response, NextFunction } from "express";

import {
  createQuestionService,
  getAllQuestionsService,
  getAdminQuestionsService,
  getQuestionByIdService,
  updateQuestionService,
  deleteQuestionService,
  toggleQuestionService,
  getPublicQuestionsService,
  getAllChipsService,
  createChipService,
  deleteChipService
} from "./question.service.js";
import type { JwtPayload } from "../../types/authTypes.js";
import { matchedData } from "express-validator";

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as JwtPayload).userId;
    const { text } = req.body;
    const question = await createQuestionService(
      userId,
      text
    );

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

export const createChip = async (req:Request,res:Response,next:NextFunction)=>{
   const userId=req.user?.userId;
   const text=req.body.text;
  console.log("chip: ",text);

  try{
    const chip=await createChipService(userId!,text);
 
    res.status(201).json({
       success: true,
       data: chip,
     });
  }
  catch(error){
    next(error)
  }
}


export const  getAllQuestions = async (
  req: Request,
  res: Response
) => {
  const data = await getAllQuestionsService();

  res.json({
    success: true,
    data,
  });
};

export const  getAllChips = async (
  req: Request,
  res: Response
) => {
  const data = await getAllChipsService(req.user?.userId!);

  res.json({
    success: true,
    data,
  });
};

export const getPublicQuestions = async (
  req: Request,
  res: Response
) => {
  try {
    const questions = await getPublicQuestionsService(req.params.id as string);

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error("getPublicQuestions error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getAdminQuestions = async (
  req: Request,
  res: Response
) => {
  const userId = (req.user as JwtPayload).userId;
  const data = await getAdminQuestionsService(userId);

  res.json({
    success: true,
    data,
  });
};

export const getQuestionById = async (
  req: Request,
  res: Response
) => {
  const {id} = req.params
  if(!id){
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }
  const data = await getQuestionByIdService(id as string, (req.user as JwtPayload).userId);

  res.json({
    success: true,
    data,
  });
};

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as JwtPayload).userId;
    const { id, text } = matchedData(req);

    const data = await updateQuestionService(id, userId, { text });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response
) => {
  const {id}=req.params 
  
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }
  await deleteQuestionService(id as string, (req.user as JwtPayload).userId);

  res.json({
    success: true,
    message: "Deleted successfully",
  });
};

export const deleteChip= async (
  req:Request,
  res:Response
)=>{
    const {id}=req.params 
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }
    await deleteChipService(id as string, (req.user as JwtPayload).userId);

    res.json({
      success: true,
      message: "Deleted successfully",
    });
}

export const toggleActive = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }

  const data = await toggleQuestionService(id as string , (req.user as JwtPayload).userId);

  res.json({
    success: true,
    data,
  });
};