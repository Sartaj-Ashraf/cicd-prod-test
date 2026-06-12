import Chips from "../../models/chips.model.js";
import {Question} from "../../models/questions.model.js";
import mongoose from "mongoose";

export const validateObjectId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid ID");
  }
};
export const createQuestionService = async (
  userId: string,
  text: string
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  // total limit
  const total = await Question.countDocuments({createdBy: userId});
  if (total >= 10) {
    throw new Error("You can only create 10 questions");
  }

  // duplicate
  const exists = await Question.findOne({
    text,
    createdBy: userId,
  });

  if (exists) {
    throw new Error("Question already exists");
  }

  // active limit
  const activeCount = await Question.countDocuments({
    createdBy: userId,
    isActive: true,
  });

  if (activeCount >= 5) {
   return await Question.create({
    createdBy: userId,
    text,
    isActive: false,
  });
  }

  return await Question.create({
    createdBy: userId,
    text,
    isActive: true,
  });
};

export const createChipService= async (userId:string,text:string)=>{
    if (!userId) {
    throw new Error("User ID is required");
  }

  // total limit
  const total = await Chips.countDocuments({createdBy: userId});
  if (total >= 10) {
    throw new Error("You can only create 10 questions");
  }

  // duplicate
  const exists = await Chips.findOne({
    text,
    createdBy: userId,
  });

  if (exists) {
    throw new Error("chip already exists");
  }
  return Chips.create({
    createdBy: userId,
    text,
  });
}

export const getAllQuestionsService = async () => {
  return await Question.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getAllChipsService=async(userId:string)=>{
   const chips = await Chips.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .lean();

   return chips;
}

export const getAdminQuestionsService = async (userId: string) => {
  validateObjectId(userId);

  return Question.find({ createdBy: userId })
    .sort({ isActive: -1, createdAt: -1 }) // 🔥 key change
    .lean();
};

export const getQuestionByIdService = async (
  id: string,
  userId: string
) => {
  validateObjectId(id);
  validateObjectId(userId);

  const question = await Question.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
};
type UpdateInput = {
  text?: string;
};

export const updateQuestionService = async (
  id: string,
  userId: string,
  data: UpdateInput
) => {
  validateObjectId(id);
  validateObjectId(userId);

  const question = await Question.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!question) {
    throw new Error("Question not found or unauthorized");
  }

  if (data.text !== undefined) {
    // duplicate check
    const exists = await Question.findOne({
      text: data.text,
      createdBy: userId,
      _id: { $ne: id },
    });

    if (exists) {
      throw new Error("Question already exists");
    }

    question.text = data.text;
  }

  await question.save();
  return question;
};
export const deleteQuestionService = async (
  id: string,
  userId: string
) => {
  validateObjectId(id);
  validateObjectId(userId);

  const question = await Question.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!question) {
    throw new Error("Question not found or unauthorized");
  }

  await question.deleteOne();

  return question;
  
};

export const deleteChipService= async (id:string,userId:string)=>{
    const chip = await Chips.findByIdAndDelete(id);

    if (!chip) {
      throw new Error("Chip not found or unauthorized");
   }
   console.log(chip);
   return 
}


export const toggleQuestionService = async (
  id: string,
  userId: string
) => {
  validateObjectId(id);
  validateObjectId(userId);

  const question = await Question.findOne({
    _id: id,
    createdBy: userId,
  });

  if (!question) {
    throw new Error("Question not found or unauthorized");
  }

  /* -------------------- TURNING ON -------------------- */
  if (!question.isActive) {
    const activeCount = await Question.countDocuments({
      createdBy: userId,
      isActive: true,
    });

    if (activeCount >= 5) {
      throw new Error("Only 5 active questions allowed");
    }
  }

  /* -------------------- TURNING OFF -------------------- */
  if (question.isActive) {
    const activeCount = await Question.countDocuments({
      createdBy: userId,
      isActive: true,
    });

    if (activeCount <= 1) {
      throw new Error("At least one question must remain active");
    }
  }

  question.isActive = !question.isActive;
  await question.save();

  return question;
};
export const getPublicQuestionsService = async (businessId: string) => {
  const questions = await Question.find({
    createdBy: businessId,
    isActive: true,
  })
    .select("_id text type")
    .sort({ createdAt: 1 })
    .lean();
  return questions;
};