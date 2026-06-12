"use client"
import Image from 'next/image'
import logo from '@/public/MangoLogo.png'
import { navLinks } from '../utils/nav-links';
import Link from 'next/link';
import { useAuth } from "@/hooks/auth.hooks";
export const Footer = () => {
  const { data, isLoading } = useAuth();
  const user = data?.user
  return (
    <footer className="py-5  text-foreground container mx-auto ">
      <div className="container mx-auto p-6 rounded-3xl bg-linear-to-t from-green-dim to-transparent ">
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          {/* Brand */}
          <div>
            <Image src={logo} alt="Logo" width={160} height={60} />
            <p className="!text-sm text-foreground mt-1">Track your growth journey</p>
          </div>

          {/* Navigation links */}
          <div className="flex flex-col sm:flex-row gap-5 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-mango-orange dark:hover:text-mango-light transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            {user  && !isLoading && (
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-mango-orange dark:hover:text-mango-light transition-colors duration-200"
              >
                Dashboard
              </Link>

              
            )}
                {user  && !isLoading && (
              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground hover:text-mango-orange dark:hover:text-mango-light transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            )}
          </div>

          {/* Social icons (Lucide) */}
          {/* <div className="flex items-center space-x-4">
            <a
              href="#"
              aria-label="GitHub"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Twitter / X"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div> */}
        </div>

        {/* Footer bottom */}
        <div className="py-2 text-center">
          <p className="!text-xs text-muted-foreground">
            {new Date().getFullYear()} Mango Review. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};