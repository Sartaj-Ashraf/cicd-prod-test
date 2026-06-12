"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useLocationContext } from "@/context/selectedLocation.context";
import { generateQRDataURL, downloadQRAsPDF } from "../utils/dashboard/qr";

import {
  QRSettings,
  PDFSettings,
  DEFAULT_QR_SETTINGS,
  DEFAULT_PDF_SETTINGS,
} from "../types/dashboard/qr";

// Debounce delay in ms — avoids re-rendering on every color picker drag tick.
const AUTO_GENERATE_DELAY = 400;

export function useQRGenerator() {
  const { selectedLocation } = useLocationContext();
  const { createdBy, placeId } = selectedLocation || {};
  const baseurl = process.env.NEXT_PUBLIC_URL;

  const qrValue =
    createdBy && placeId
      ? `${baseurl}/feedback?createdBy=${createdBy}&placeId=${placeId}`
      : "";

  // ── Settings state ──
  const [qrSettings, setQRSettings] = useState<QRSettings>(DEFAULT_QR_SETTINGS);
  const [pdfSettings, setPDFSettings] = useState<PDFSettings>(DEFAULT_PDF_SETTINGS);

  // ── Generation state ──
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  // ── Core generate (silent — used by both auto and manual paths) ──
  const generate = useCallback(async (settings: QRSettings, value: string) => {
    if (!value) return;
    setGenerating(true);
    try {
      const url = await generateQRDataURL(value, settings.fgColor, settings.logoDataUrl);
      setQrDataUrl(url);
      setGenerated(true);
    } catch {
      toast.error("Failed to generate QR code.");
    } finally {
      setGenerating(false);
    }
  }, []);

  // ── Auto-regenerate whenever settings or location change (debounced) ──
  useEffect(() => {
    if (!qrValue) return;
    const timer = setTimeout(() => generate(qrSettings, qrValue), AUTO_GENERATE_DELAY);
    return () => clearTimeout(timer);
  }, [qrSettings, qrValue, generate]);

  // ── Logo ──
  const setLogo = useCallback((dataUrl: string | null) => {
    setQRSettings((prev) => ({ ...prev, logoDataUrl: dataUrl }));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-uploading the same file
  };

  // ── Manual generate (button — shows a success toast) ──
  const handleGenerate = async () => {
    await generate(qrSettings, qrValue);
    if (qrValue) toast.success("QR code generated!");
  };

  // ── Downloads ──
  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-feedback-${placeId || "code"}.png`;
    a.click();
    toast.success("PNG downloaded!");
  };

  const handleDownloadPDF = async () => {
    if (!qrDataUrl) return;
    try {
      await downloadQRAsPDF(qrDataUrl, pdfSettings, placeId || "code");
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF.");
    }
  };

  // ── Copy link ──
  const handleCopy = async () => {
    if (!qrValue) return;
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    // Location
    selectedLocation,
    qrValue,
    noLocation: !qrValue,
    // Settings
    qrSettings,
    setQRSettings,
    pdfSettings,
    setPDFSettings,
    // Logo
    logoInputRef,
    setLogo,
    handleLogoUpload,
    // QR
    qrDataUrl,
    generated,
    generating,
    handleGenerate,
    // Downloads / copy
    handleDownloadPNG,
    handleDownloadPDF,
    copied,
    handleCopy,
  };
}