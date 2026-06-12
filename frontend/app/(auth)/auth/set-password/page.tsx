"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import logo from "@/public/logo.png";
import { setPassword } from "@/services/auth/auth.services";
import {
  setPasswordSchema,
  setPasswordSchemaType,
} from "@/validation/auth.schema";

 function SetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<setPasswordSchemaType>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const password = watch("password");
  const [confirm, setConfirm] = useState("");

  const submit = async (data: setPasswordSchemaType) => {
    if (!token) {
      toast.error("Invalid Link");
      return;
    }

    if (data.password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await setPassword(token, data.password);

      toast.success("Password Updated");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border bg-card shadow-sm">

        <div className="text-center mb-6">
          <Image
            src={logo}
            alt="Logo"
            width={90}
            height={90}
            className="mx-auto mb-3"
          />

          <h4 className="text-3xl font-bold">
            Set Password
          </h4>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                {...register("password")}
                className="w-full h-12 px-4 pr-12 rounded-2xl border"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full h-12 px-4 pr-12 rounded-2xl border"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Rules */}
          {password.length > 0 && (
            <p className="text-xs text-muted-foreground leading-5">
              • 6-15 characters <br />
              • 1 uppercase letter <br />
              • 1 lowercase letter <br />
              • 1 number <br />
              • 1 symbol
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl text-white font-semibold bg-orange-500"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          Remember Password?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}


export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordPageContent />
    </Suspense>
  )
}
