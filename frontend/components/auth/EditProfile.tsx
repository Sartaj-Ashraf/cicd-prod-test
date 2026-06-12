"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateProfile } from "@/services/auth/auth.services"
import { queryClient } from "@/utils/query-client"
import { MeResponse } from "@/types/auth/auth.types"
const schema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(50, "Name must be under 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Only letters allowed"),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter valid phone number"),
})

type FormData = z.infer<typeof schema>

export default function ChangeProfileForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
const data = queryClient.getQueryData(["auth","me"]) as MeResponse
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
useEffect(() => {
  if (data) {
    const userData = data.user as FormData
    reset({
      name: userData.name,
      phoneNumber: userData.phoneNumber,
    })
  }
}, [data, reset])
  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      const res=await updateProfile(data.name, data.phoneNumber);

      onClose()
      if(res.success)
      queryClient.invalidateQueries({ queryKey: ["auth","me"] });
      toast.success("Profile updated successfully")
      reset(data)
    } catch {
      // handled in service
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">

      {/* Header */}
      <div className="mb-6 border-b border-border pb-4">
        <h4 className=" font-bold tracking-tight text-leaf-dark">
          Update Profile
        </h4>

        <span className="text-xs text-muted-foreground mt-1">
          Change your name and phone number.
        </span>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Full Name
          </label>

          <Input
            type="text"
            placeholder="Enter your name"
            className="h-11 rounded-xl"
            {...register("name")}
            maxLength={50}
            minLength={4}
          />

          {errors.name && (
            <p className="text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Phone Number
          </label>

          <Input
            type="tel"
            placeholder="Enter phone number"
            className="h-11 rounded-xl"
            {...register("phoneNumber")}
            />

          {errors.phoneNumber && (
            <p className="text-xs text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl font-semibold bg-mango-orange"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>

      </form>
    </div>
  )
}