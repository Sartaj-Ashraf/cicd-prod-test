"use client"

import { Controller, useForm } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye } from "lucide-react"
import { EyeOff } from "lucide-react"
import { loginSchema, loginSchemaType } from "@/validation/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUser } from "@/services/auth/auth.services"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import logo from "@/public/MangoLogo.png"
import Image from "next/image"
import { queryClient } from "@/utils/query-client"

export default function LoginForm() {
  const searchParams = useSearchParams()
  const path = searchParams.get("path") || "dashboard"
  const error = searchParams.get("error");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter()
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const { control, handleSubmit, watch } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "umaid21434@gmail.com",
      password: "Asd@123",
    },
  })
  const email = watch("email");

  const submitForm = async (data: loginSchemaType) => {
    try {
      setBtnDisabled(true);
      const response = await loginUser(data)
      queryClient.setQueryData(["auth", "me"], {
        user: response.data
      })
      toast.success("Welcome to Mango!")
      router.push(`/${path}`)

    } catch (error) {

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

      setErrorOpen(true);

      console.log("Login failed");
    } finally {
      setBtnDisabled(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      window.location.href =
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;

      setGoogleLoading(false);
    }
    finally {

      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!error) return

    setTimeout(() => {
      toast.error(decodeURIComponent(error));
      window.history.replaceState({}, "", "/auth/login");

    }, 100);

  }, [error]);


  return (
    <div className="flex items-center justify-center w-full px-4 py-8 bg-background">

      {/* Card */}
      <div className="w-full max-w-md rounded-3xl border border-border bg-card text-card-foreground backdrop-blur p-8 shadow-xm">

        {/* Header */}
        <div className="mb-6 text-center">

          <div className="flex items-center justify-center mb-4  select-none">
            <Image src={logo} alt="Mango Logo" width={100} height={100} />
          </div>


          <h4
            className="text-3xl font-bold bg-clip-text text-transparent  select-none"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--mango-orange), var(--star-bright))",
            }}
          >
            Welcome back
          </h4>

          <p className="text-xs text-muted-foreground mt-2 select-none">
            Login to your Mango account
          </p>
        </div>
        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full  cursor-pointer  border border-input h-12 rounded-2xl flex items-center justify-center gap-3 bg-card hover:bg-accent transition-all duration-200 font-medium disabled:opacity-70"
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
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--mango-orange)" }}
          >
            OR
          </span>

          <div className="h-px bg-border w-full"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

          <FieldGroup>

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs text-gray-600" htmlFor="email">Email</FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 rounded-2xl "
                    style={{
                      borderColor: "var(--input)",
                    }}
                  />

                  {fieldState.invalid && (
                    <FieldError className="text-xs " errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel className="text-xs text-gray-600" htmlFor="password">Password</FieldLabel>

                    <button
                      type="button"
                      className="text-xs hover:underline  cursor-pointer"
                      style={{ color: "var(--mango-orange)" }}
                      onClick={() =>
                        router.push(
                          `/auth/forgot-password?email=${encodeURIComponent(email || "")}`
                        )
                      }
                    >

                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 rounded-2xl pr-12"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError className="text-xs" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

          </FieldGroup>
          {errorMessage && (
            <div
              className="
        flex items-start gap-3
        rounded-xl
        border border-mango-orange/20
        bg-mango-orange/10
        px-3 py-2
      "
    >
    
      <p className="text-sm leading-5 text-red-700">
        {errorMessage}
      </p>
    </div>
          )}
          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold cursor-pointer rounded-2xl text-white shadow-lg bg-mango-orange"
            disabled={btnDisabled}

          >
            Login
          </Button>

        </form>

        {/* Footer */}
        <p className="text-sm text-center text-muted-foreground mt-6  select-none">
          Don’t have an account?{" "}
          <span
            className="font-medium hover:underline cursor-pointer"
            style={{ color: "var(--mango-orange)" }}
            onClick={() => router.push("/auth/register")}
          >
            Sign up
          </span>
        </p>


      </div>
      
    </div>
  )
}
