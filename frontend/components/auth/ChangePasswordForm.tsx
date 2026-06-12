"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { changePassword } from "@/services/auth/auth.services"

const strongPassword = z
  .string()
  .min(6, "Password length must be between 6 to 15 characters")
  .max(15, "Password length must be between 6 to 15 characters")
  .regex(/[A-Z]/, "Password must include uppercase, lowercase, number and symbol")
  .regex(/[a-z]/, "Password must include uppercase, lowercase, number and symbol")
  .regex(/[0-9]/, "Password must include uppercase, lowercase, number and symbol")
  .regex(/[^A-Za-z0-9]/, "Password must include uppercase, lowercase, number and symbol")

const schema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),

    newPassword: strongPassword,

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type FormData = z.infer<typeof schema>

export default function ChangePasswordForm( ) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      await changePassword(
        data.oldPassword,
        data.newPassword
      )

      toast.success("Password changed successfully. Please login again.")

      reset()

      setTimeout(() => {
        router.push("/auth/login")
      }, 700)
    } catch {
      // handled in service
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-6 border-b border-border pb-4">
        <h4 className="text-base font-bold tracking-tight">
          Change Password
        </h4>

        <span className="text-sm text-muted-foreground mt-1">
          Update your password to keep your account secure.
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Current Password
          </label>

          <Input
            type="password"
            placeholder="Enter current password"
            className="h-11 rounded-xl"
            {...register("oldPassword")}
          />

          {errors.oldPassword && (
            <p className="text-xs text-destructive">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            New Password
          </label>

          <Input
            type="password"
            placeholder="Enter new password"
            className="h-11 rounded-xl"
            {...register("newPassword")}
          />

          {errors.newPassword && (
            <p className="text-xs text-destructive">
              {errors.newPassword.message}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            6-15 chars, uppercase, lowercase, number, symbol.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Confirm Password
          </label>

          <Input
            type="password"
            placeholder="Re-enter new password"
            className="h-11 rounded-xl"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold"
        >
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  )
}