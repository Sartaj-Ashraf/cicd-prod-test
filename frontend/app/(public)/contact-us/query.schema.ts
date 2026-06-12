import z from "zod"

export const subjectOptions = ["General Inquiry","Request A demo", "Support", "Billing Query", "Other"] as const;

export const querySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),

  subject: z
    .enum(subjectOptions),    
  message: z
    .string()
    .optional(),

  businessName: z
    .string()
    .optional(),
});
export type querySchemaType = z.infer<typeof querySchema>

