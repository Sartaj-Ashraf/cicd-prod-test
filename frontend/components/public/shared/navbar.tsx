"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "../utils/nav-links";
import Image from "next/image";
import logo from "@/public/MangoLogo.png";
import {
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/hooks/auth.hooks";
import { logout } from "@/services/auth/auth.services";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { MeResponse } from "@/types/auth/auth.types";
import { useTheme } from "next-themes";

function UserDropdown({ user }: { user: MeResponse["user"] }) {
  const [open, setOpen] = useState(false);
  const [logoutConfirmationModalOpen, setLogoutConfirmationModalOpen] =
    useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = (user?.name || "NA")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    await logout();
    toast.success("Redirecting... to login page");
    router.push("/auth/login");
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    setIsLoading(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 focus:outline-none"
      >
        <div className="w-7 h-7 md:w-8 md:h-8 capitalize text-xs bg-linear-to-br from-leaf-dark to-leaf-light text-white font-semibold rounded-full flex items-center justify-center">
          {initials}
        </div>
        <ChevronDown
          size={13}
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg shadow-black/[0.06] z-50 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-leaf-dark to-leaf-light text-white text-sm font-bold rounded-full flex items-center justify-center uppercase shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground capitalize truncate">
                  {user?.name}
                </p>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
          <div className="px-3 py-2 space-y-0.5">
            <Link href="/dashboard">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors">
                <LayoutDashboard size={14} />
                <span>Dashboard</span>
              </button>
            </Link>
          </div>
          <div className="px-3 pb-2.5 pt-1 border-t border-border mt-1">
            <button
              onClick={() => {
                setOpen(false);
                setLogoutConfirmationModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={logoutConfirmationModalOpen}
        onClose={() => setLogoutConfirmationModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────

function MobileMenu({
  open,
  onClose,
  user,
  isLoading: authLoading,
}: {
  open: boolean;
  onClose: () => void;
  user?: MeResponse["user"];
  isLoading: boolean;
}) {
  const [logoutConfirmationModalOpen, setLogoutConfirmationModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    await logout();
    toast.success("Redirecting... to login page");
    router.push("/auth/login");
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    setIsLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`
          md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Slide-up sheet */}
      <div
        className={`
          md:hidden fixed bottom-0 left-0 right-0 z-50
          bg-card rounded-t-3xl shadow-2xl shadow-black/20
          transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-muted rounded-full" />
        </div>

        {/* User info strip (if logged in) */}
        {user && (
          <div className="mx-4 mt-3 mb-1 px-4 py-3 bg-accent rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-leaf-dark to-leaf-light text-white text-sm font-bold rounded-full flex items-center justify-center uppercase shrink-0">
              {(user.name || "NA")
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground capitalize truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="px-4 pt-2 pb-2">
          <ul className="space-y-0.5">
            {navLinks.map((link, i) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl text-foreground text-[15px] font-medium hover:bg-accent active:bg-accent/80 transition-colors"
                  style={{ transitionDelay: open ? `${i * 30}ms` : "0ms" }}
                >
                  <span>{link.name}</span>
                  <span className="text-muted-foreground text-sm">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="mx-4 mb-safe-bottom border-t border-border pt-3 pb-6 flex flex-col gap-2">
          {user ? (
            <>
              <Link href="/dashboard" onClick={onClose}>
                <button className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground hover:bg-accent rounded-xl transition-colors">
                  <LayoutDashboard size={15} />
                  <span>Dashboard</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  onClose();
                  setLogoutConfirmationModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link href="/auth/login" onClick={onClose}>
              <button className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-leaf-dark to-leaf-light text-white py-2 rounded-md text-sm font-semibold">
                <User size={15} />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={logoutConfirmationModalOpen}
        onClose={() => setLogoutConfirmationModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export const Navbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const user = data?.user;

  return (
    <>
      <div className="sticky top-5 z-50 flex flex-col items-center px-4 w-full md:max-w-5xl mx-auto">
        {/* Main Nav */}
        <nav className="flex items-center  md:justify-between gap-2 bg-test-bg border-[1.35px] border-green-dim backdrop-blur-sm rounded-3xl px-4 py-2 w-full shadow-sm">
          {/* Logo */}
          <Link href='/' className="w-18 rounded-full mr-auto">
            <Image src={logo} alt="Logo" width={100} height={100} />
          </Link >

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center flex-1 justify-center list-none ">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-foreground text-[15px] font-normal px-[18px] py-[10px] rounded-full hover:text-mango-orange transition-colors duration-200 block whitespace-nowrap"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: user / login */}
          <div className="hidden md:flex">
            <button
              className=" mr-2 bg-muted w-8 h-8 flex items-center justify-center rounded-md border "
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ?   <Sun size={16} />:<Moon size={16} />}
            </button>
            {!isLoading && user ? (
              <UserDropdown user={user} />
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1 bg-linear-to-br from-leaf-dark to-leaf-light px-2 py-1.5 text-white rounded-sm"
              >
                <User size={16} /> <span className="text-sm">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile: right side */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            {/* Avatar pill if logged in */}
             <button
              className=" bg-muted w-7 h-7 flex items-center justify-center rounded-md border"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ?  <Sun size={16} />: <Moon size={16} />}
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="w-8 h-8 rounded-full bg-accent flex items-center justify-center transition-colors active:bg-accent/80"
            >
              {!isLoading && user ? (
                <div className="w-7 h-7 bg-linear-to-br from-leaf-dark to-leaf-light text-white text-xs font-semibold rounded-full flex items-center justify-center uppercase">
                  {(user.name || "NA")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              ) : (
                <Menu size={16} className="text-muted-foreground" />
              )}
            </button>
          </div>
        </nav>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        user={user}
        isLoading={isLoading}
      />
    </>
  );
};
