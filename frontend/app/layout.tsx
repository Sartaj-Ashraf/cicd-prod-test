import type { Metadata } from "next";
import { Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import AuthGuard from "@/components/auth/authGuard";
import ClickSpark from "@/components/ui/ClickSpark";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { LocationProvider } from "@/context/selectedLocation.context";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mango Review",
  description: "Mango Review is a platform for reviewing and rating businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
    <ThemeProvider  attribute="class" defaultTheme="system" enableSystem>
        <ClickSpark
          sparkColor="#EAB308"
          sparkSize={8}
          sparkRadius={20}
          sparkCount={8}
          duration={500}
        >
          <LocationProvider>
            <Providers>
              <AuthGuard>{children}</AuthGuard>
            </Providers>
          </LocationProvider>
        </ClickSpark>

<Toaster position="top-right"
  richColors
  closeButton
  expand
  visibleToasts={4}
  duration={3000}
  toastOptions={{
    className: "rounded-xl border shadow-lg",
    descriptionClassName: "text-sm opacity-90",
    actionButtonStyle: {
      borderRadius: "10px",
    },
    cancelButtonStyle: {
      borderRadius: "10px",
    },
  }}
  
/>    
  </ThemeProvider>

  </body>
    </html>
  );
}
