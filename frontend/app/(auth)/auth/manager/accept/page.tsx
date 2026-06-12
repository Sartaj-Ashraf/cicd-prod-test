"use client";

import { Suspense, useEffect, useState }         from "react";
import Image                           from "next/image";
import { useRouter, useSearchParams }  from "next/navigation";
import { toast }                       from "sonner";
import { Loader2 }                     from "lucide-react";

import logo                   from "@/public/logo.png";
import { acceptInviteApi } from "@/services/manager/manager.service";

function AcceptInvitePageContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get("token");

  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing invite link.");
      return;
    }
    handleAccept();
  }, [token]);

  const handleAccept = async () => {
    if (!token) return;
    setStatus("loading");

    const result = await acceptInviteApi(token);

    if (result?.success) {
      setStatus("success");
      toast.success("Invite accepted successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } else {
      setStatus("error");
      setMessage(result?.message ?? "Failed to accept invite. Please try again.");
      toast.error(result?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-3xl border bg-card shadow-sm text-center">

        <Image
          src={logo}
          alt="Logo"
          width={90}
          height={90}
          className="mx-auto mb-4"
        />

        {/* loading */}
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin mx-auto mb-4 text-orange-500" size={32} />
            <h4 className="text-2xl font-bold mb-2">Accepting Invite</h4>
            <p className="text-sm text-muted-foreground">
              Please wait while we process your invitation...
            </p>
          </>
        )}

        {/* idle */}
        {status === "idle" && (
          <>
            <Loader2 className="animate-spin mx-auto mb-4 text-orange-500" size={32} />
            <h4 className="text-2xl font-bold mb-2">Processing</h4>
            <p className="text-sm text-muted-foreground">
              Please wait...
            </p>
          </>
        )}

        {/* success */}
        {status === "success" && (
          <>
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold mb-2">Invite Accepted!</h4>
            <p className="text-sm text-muted-foreground">
              You now have access to this location. Redirecting to dashboard...
            </p>
          </>
        )}

        {/* error */}
        {status === "error" && (
          <>
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold mb-2">Something went wrong</h4>
            <p className="text-sm text-muted-foreground mb-6">{message}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full h-12 rounded-2xl text-white font-semibold bg-orange-500"
            >
              Go to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}


const AcceptInvitePage = () => {
  return (
    <Suspense fallback={null}>
         <AcceptInvitePageContent />
       </Suspense>
  )
}

export default AcceptInvitePage