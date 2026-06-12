import { z } from "zod";

export const feedbackSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name is too long"),

  phoneNumber: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^[0-9]{10}$/.test(value),
      {
        message: "Phone number must be 10 digits",
      }
    ),

  comment: z
    .string()
    .trim()
    .max(500, "Comment is too long")
    .optional()
    .or(z.literal("")),
});
export type FeedbackForm = z.infer<typeof feedbackSchema>;