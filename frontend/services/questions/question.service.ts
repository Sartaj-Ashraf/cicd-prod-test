"use client";

import customFetch from "@/utils/customFetch";
import axios from "axios";
import { toast } from "sonner";

import {
  createChipSchema,
  createQuestionSchema,
  updateQuestionSchema,
} from "@/validation/dashboard/question.validation";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

export type Question = {
  _id: string;
  text: string;
  type: "stars" | "text" | "yes_no";
  isActive: boolean;
  createdAt: string;
};

export type Chip ={
  _id:string;
  text:string
}

const BASE_URL = "/questions";

/* -------------------------------------------------------------------------- */
/* ERROR HANDLER */
/* -------------------------------------------------------------------------- */

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    console.log("Error data:", data);
    if (data?.errors?.length) {
      const msg = data.errors
        .map((item: any) => item.msg)
        .join(", ");

      toast.error(msg);
      throw new Error(msg);
    }

    const message = data?.message || error.message;

    toast.error(message);
    throw new Error(message);
  }

  if (error instanceof Error) {
    toast.error(error.message);
    throw error;
  }

  toast.error("Something went wrong");
  throw new Error("Something went wrong");
};

/* -------------------------------------------------------------------------- */
/* SERVICES */
/* -------------------------------------------------------------------------- */

export const getAdminQuestions = async () => {
  try {
    const response = await customFetch.get(
      `${BASE_URL}/admin`
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAdminChips= async ()=>{
   try {
    const response = await customFetch.get(
      `${BASE_URL}/admin/chips`
    );

    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export const createQuestion = async (
  text: string
) => {
  try {
    const validated = createQuestionSchema.safeParse({ text });

    if (!validated.success) {
      toast.error(validated.error.issues[0].message);
      return;
    }
    const response = await customFetch.post(
      `${BASE_URL}`,
      {
        text: validated.data.text,
      }
    );
    
    toast.success("chip created");

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createChip=async (text:string)=>{
   try {
    const validated = createChipSchema.safeParse({ text });

    if (!validated.success) {
      toast.error(validated.error.issues[0].message);
      return;
    }
    const response = await customFetch.post(
      `${BASE_URL}/create-chip`,
      {
        text: validated.data.text,
        type: "stars",
      }
    );
    
    toast.success("chip created created successfully");

    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export const updateQuestion = async (
  id: string,
  text: string
) => {
  try {
    const validated = updateQuestionSchema.safeParse({ text });

    if (!validated.success) {
      toast.error(validated.error.issues[0].message);
      return;
    }

    const response = await customFetch.put(
      `${BASE_URL}/${id}`,
      {
        text: validated.data.text,
      }
    );

    toast.success("Question updated");

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteQuestion = async (
  id: string
) => {
  try {
    const response =
      await customFetch.delete(
        `${BASE_URL}/${id}`
      );

    toast.success("Question deleted");

    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteChip= async (id:string)=>{
  try {
    const response =
      await customFetch.delete(
        `${BASE_URL}/delete-chip/${id}`
      );

    toast.success("Chip deleted successfully");

    return response.data;
  } catch (error) {
    handleError(error);
  }
};


export const toggleQuestion = async (
  id: string
) => {
  try {
    const response =
      await customFetch.patch(
        `${BASE_URL}/${id}/toggle`
      );

    toast.success("Question updated");

    return response.data;
  } catch (error) {
    handleError(error);
  }
};
export const getPublicQuestion=async(id:string)=>{
  try {
    const response = await customFetch.get(`${BASE_URL}/public/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}