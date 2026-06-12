import z from "zod"

export const loginSchema = z.object({
  email: z
    .email()
    .regex(/@gmail\.com$/, "Enter a valid email"),
    
  password: z
    .string()
    .min(1, "Password is required"),
})

export type loginSchemaType = z.infer<typeof loginSchema>



export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(4, "Name must be at least 4 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Name can only contain letters, spaces, apostrophes, and hyphens"
    ),

  email: z.email("Enter a valid email address"),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian phone number"),
});

const passwordSchema = z
  .string()
  .min(6, "Password must be 6 to 15 characters")
  .max(15, "Password must be 6 to 15 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number")
  .regex(/[^A-Za-z0-9]/, "Must contain symbol");



export const setPasswordSchema = z.object({
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: passwordSchema,
});

export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid Email")
    .regex(/\.com$/i, "Email must contain .com"),
});

export const updateProfileSchema = z.object({
    name: z
      .string()
      .min(4, "Name must be at least 4 characters")
      .regex(/^[A-Za-z\s]+$/, "Name must contain only letters")
      .optional(),

    phoneNumber: z
      .string()
      .regex(/^\+?[1-9]\d{7,14}$/, "Enter a valid phone number")
      .optional(),
  })
  .refine(
    (data) => data.name || data.phoneNumber,
    {
      message: "Name or phone number is required",
      path: ["name"],
    }
  )
export type registerSchemaType = z.infer<typeof registerSchema>
export type updateProfileSchemaType = z.infer<typeof updateProfileSchema>

export type setPasswordSchemaType = z.infer<typeof setPasswordSchema>;
export type changePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type forgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;