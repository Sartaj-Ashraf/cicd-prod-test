"use client"

import { Suspense, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import logo from "@/public/MangoLogo.png"
import { forgotPassword } from "@/services/auth/auth.services"
import {
  forgetPasswordSchema,
  forgetPasswordSchemaType,
} from "@/validation/auth.schema"

function ForgotPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const emailFromParams = searchParams.get("email") || ""
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetPasswordSchemaType>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: emailFromParams,
    },
  })

  const submit = async (data: forgetPasswordSchemaType) => {
    try {
      setLoading(true)

      await forgotPassword(data.email)

      toast.success("Reset link sent to your email")

      setTimeout(() => {
        router.push("/auth/login")
      }, 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center w-full px-4 py-4 bg-background select-none">

      <div className="w-full max-w-md rounded-3xl border border-border bg-card text-card-foreground p-8 shadow-xm">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Image
              src={logo}
              alt="Mango Logo"
              width={100}
              height={100}
            />
          </div>

          <h4 className="text-3xl font-bold bg-clip-text text-transparent bg-mango-orange">
            Forgot Password
          </h4>

          <p className="text-xs text-muted-foreground mt-2">
            Enter your email to receive reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-xs text-gray-600 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full h-12 px-4 rounded-2xl border"
            />

            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-semibold rounded-2xl text-white disabled:opacity-70 bg-mango-orange"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground mt-6">
          Remember your password?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="font-medium hover:underline cursor-pointer"
            style={{ color: "var(--mango-orange)" }}
          >
            Back to Login
          </span>
        </p>

      </div>
    </div>
  )
}


const ForgetPassword = () => {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}

export default ForgetPassword