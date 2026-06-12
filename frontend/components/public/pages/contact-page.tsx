"use client";
import React from "react";
import { Mail, Phone, Clock, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendFormQuery } from "@/services/public/query.service";
import { querySchema, querySchemaType, subjectOptions } from "@/app/(public)/contact-us/query.schema";
import { toast } from "sonner";
import Link from "next/link";

export const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<querySchemaType>({
    resolver: zodResolver(querySchema),
  });

  const onSubmit = async (data: querySchemaType) => {
    await sendFormQuery(data);
    toast.success("Message sent successfully");
    reset();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="mx-8 relative flex flex-col items-center justify-center text-center overflow-hidden rounded-2xl px-6 py-16 bg-linear-to-br from-leaf-main/10 via-transparent to-leaf-main/10 my-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-mango-soft/50 bg-card/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-base-black text-[8px] text-white">
            ✦
          </span>
          Get In Touch
        </div>

        <h1 className="font-semibold leading-tight text-muted-foreground">
          We'd Love to
          <span className="block text-foreground">Hear From You</span>
        </h1>

        <p className="mt-4 mb-7 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Have questions about our AI-powered review management platform? Reach
          out to our team and we'll get back to you as soon as possible.
        </p>
      </section>

      <div className="container space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-mango-orange mb-5">
              Get in touch
            </p>
            <h4 className="font-medium text-foreground mb-2">
              Send us a message
            </h4>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              We'll get back to you within one business day.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border border-gray-medium rounded-xl p-4">
              {/* Name */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-lg"
                  placeholder="John"
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-lg"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-lg"
                  placeholder="Your Phone Number"
                />
                {errors.phoneNumber && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Business */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Business name
                </label>
                <input
                  type="text"
                  {...register("businessName")}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-lg"
                  placeholder="Your Business LLC"
                />
              </div>
              {/* Business */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Subject 
                </label>
                <select
                  {...register("subject")}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-lg"
                >
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {/* Message */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">
                  Message
                </label>
                <textarea
                    {...register("message")}
                  rows={4}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted border border-border rounded-lg"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-leaf-main rounded-lg"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

          <div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-mango-orange mb-5">
                Contact details
              </p>
              <h4 className="font-medium text-foreground mb-2">
                We're here to help
              </h4>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                Reach out through any channel that works for you.
              </p>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Email</p>
                    <Link href="mailto:support@mangoreview.com" className="text-xs text-muted-foreground block">
                      support@mangoreview.com
                    </Link>
                    <Link href="mailto:contact@mangoreview.com" className="text-xs text-muted-foreground block">
                      contact@mangoreview.com
                    </Link>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Link href="tel:8491012121" className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">
                      Phone
                    </p>
                    <p className="text-sm text-muted-foreground">+91 8491012121</p>
                  </div>
                </div>

                {/* Available */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Available
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      <span className="text-sm text-muted-foreground">24x7 Support</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-xs font-medium uppercase tracking-widest text-mango-orange mb-2">
                  Follow us
                </p>
                <p className="text-sm text-muted-foreground mb-5">
                  Stay connected for updates, tips, and exclusive offers.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="https://wa.me/918491012121"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <span className="w-12 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center group-hover:bg-[#25D366] group-hover:border-[#25D366] group-hover:shadow-lg group-hover:shadow-[#25D366]/20 group-hover:scale-105 transition-all duration-300">
                      <svg className="w-5 h-5 text-[#25D366] group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors duration-300">WhatsApp</span>
                  </Link>
                  {/* <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <span className="w-12 h-12 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center group-hover:bg-[#1877F2] group-hover:border-[#1877F2] group-hover:shadow-lg group-hover:shadow-[#1877F2]/20 group-hover:scale-105 transition-all duration-300">
                      <svg className="w-5 h-5 text-[#1877F2] group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors duration-300">Facebook</span>
                  </Link> */}
                  <Link
                    href="https://www.instagram.com/mangoreview_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <span className="w-12 h-12 rounded-xl bg-linear-to-br from-[#833AB4]/10 via-[#FD1D1D]/10 to-[#F77737]/10 border border-[#E1306C]/20 flex items-center justify-center group-hover:bg-linear-to-br group-hover:from-[#833AB4] group-hover:via-[#FD1D1D] group-hover:to-[#F77737] group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-[#E1306C]/20 group-hover:scale-105 transition-all duration-200">
                      <svg className="w-5 h-5 text-[#E1306C] group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors duration-300">Instagram</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};