"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import Image from "next/image"

import logo from "@/public/MangoLogo.png"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import  GmailStepsModal  from "./GmailStepsModal"
import {
  registerSchema,
  registerSchemaType,
} from "@/validation/auth.schema"

import { registerUser } from "@/services/auth/auth.services"


// ─── Register Form ─────────────────────────────────────────────────────────────
export default function RegisterForm() {
  const router = useRouter()
  const [googleLoading, setGoogleLoading] = useState(false)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")
  const [emailAlreadySent, setEmailAlreadySent] = useState(false)

  const { control, handleSubmit } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
    },
  })

  const submitForm = async (data: registerSchemaType) => {
    setBtnDisabled(true)
    try {
      const response = await registerUser(data)
  if (response?.success) {
      setRegisteredEmail(data.email)
      setEmailAlreadySent(false)
      setShowEmailModal(true)
      return
    }
      // 201 — brand new user created, verification email sent
      // 200 — user existed but was unverified, new email sent
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        setRegisteredEmail(data.email)
        setEmailAlreadySent(false)
        setShowEmailModal(true)
        return
      }

      // Fallback success (shouldn't normally hit here)
      toast.success(response.message || "Account created!")
      setTimeout(() => {
        router.push("/auth/login")
      }, 400)
    } catch (error: unknown) {
      // 429 — token still valid, email already sent → show modal instead of just toast
      // The registerUser service already called toast.error(), but we override
      // the UX here by showing the helpful modal instead.
      const message =
        error instanceof Error ? error.message : ""

      if (message.toLowerCase().includes("verification already sent")) {
        setRegisteredEmail(data.email)
        setEmailAlreadySent(true)
        setShowEmailModal(true)
        // Dismiss the toast that was fired in the service so modal is the only UI
        toast.dismiss()
        return
      }

      // 409 conflict (user already verified), 400, etc.
      // These are already toasted by registerUser service — nothing more to do.
    } finally {
      setBtnDisabled(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true)
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`
      toast.loading("Redirecting to Google...")
    } finally {
      setGoogleLoading(false)
      toast.dismiss()
    }
  }

  return (
    <>
      {/* Gmail Steps Modal */}
      {showEmailModal && (
        <GmailStepsModal
          email={registeredEmail}
          alreadySent={emailAlreadySent}
          onClose={() => setShowEmailModal(false)}
        />
      )}

      <div className="flex items-center justify-center w-full px-4 py-7 bg-background">
        {/* Card */}
        <div className="w-full max-w-md rounded-3xl border border-border bg-card text-card-foreground backdrop-blur p-8 shadow-xm">

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Image src={logo} alt="Mango Logo" width={100} height={100} />
            </div>
            <h4
              className="font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--mango-orange), var(--star-bright))",
              }}
            >
              Create account
            </h4>
            <p className="text-xs! text-muted-foreground mt-2 select-none">
              Join Mango and start today
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border border-input h-10 rounded-2xl flex items-center justify-center gap-3 bg-card hover:bg-accent transition-all duration-200 font-medium disabled:opacity-70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 15.3 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.8-3.3-11.4-8l-6.5 5C9.4 39.4 16.1 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.2 5.3-6 6.8l6.3 5.2C39.5 36.3 44 30.7 44 24c0-1.3-.1-2.4-.4-3.5z"
              />
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-border w-full"></div>
            <span
              className="text-xs font-semibold tracking-widest uppercase select-none"
              style={{ color: "var(--mango-orange)" }}
            >
              OR
            </span>
            <div className="h-px bg-border w-full"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
            <FieldGroup>

              {/* Name */}
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name" className="text-xs text-gray-600">
                      Name <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Your name"
                      required
                      className="h-12 rounded-2xl"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email" className="text-xs text-gray-600">
                      Email <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="h-12 rounded-2xl"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Phone Number */}
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phoneNumber" className="text-xs text-gray-600">
                      Phone Number <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="phoneNumber"
                      placeholder="Enter phone number"
                      required
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      className="h-12 rounded-2xl"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        field.onChange(value)
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

            </FieldGroup>

            {/* Submit */}
            <Button
              type="submit"
              disabled={btnDisabled}
              className="w-full h-12 text-base font-semibold rounded-2xl text-white bg-mango-orange shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {btnDisabled ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-muted-foreground mt-4 select-none">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/auth/login")}
              className="font-medium hover:underline cursor-pointer"
              style={{ color: "var(--mango-orange)" }}
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </>
  )
}