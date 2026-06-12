import { z } from "zod";

export const createQuestionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Question must be at least 3 characters")
    .max(120, "Question cannot exceed 120 characters"),
});

export const createChipSchema=z.object({
  text:z.string().trim().min(3,"Chip must be atleast 3 charcters long").max(100,"Chip cannot exceed 100 characters")
})

export const updateQuestionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Question must be at least 3 characters")
    .max(120, "Question cannot exceed 120 characters"),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;