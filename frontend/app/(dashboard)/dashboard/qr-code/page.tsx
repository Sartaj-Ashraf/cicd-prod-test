"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import logo from "@/public/MangoLogo.png";

import { useQRGenerator } from "@/hooks/useQRGenerator";
import { QRPreviewCard } from "@/components/dashboard/qr/QRPreviewCard";
import { QRSettingsCard } from "@/components/dashboard/qr/QRSettingsCard";
import { PDFSettingsCard } from "@/components/dashboard/qr/PDFSettingsCard";
import { ActionBar } from "@/components/dashboard/qr/ActionBar";
import { PrintPreviewCard } from "@/components/dashboard/qr/Printpreviewcard";

export default function QRGeneratorPage() {
  const {
    selectedLocation,
    noLocation,
    qrSettings,
    setQRSettings,
    pdfSettings,
    setPDFSettings,
    logoInputRef,
    setLogo,
    handleLogoUpload,
    qrDataUrl,
    generated,
    generating,
    handleGenerate,
    handleDownloadPNG,
    handleDownloadPDF,
    copied,
    handleCopy,
  } = useQRGenerator();

  return (
    <TooltipProvider>
      <div className="bg-background">
        <div className="mx-auto py-8">

          {/* ── Header ── */}
          <div className="md:mb-4">
            <h4 className="font-bold">QR Code Generator</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Generate a print ready QR for{" "}
              {selectedLocation?.name && (
                <span className="font-semibold text-leaf-dark">{selectedLocation.name}</span>
              )}{" "}
              customer feedback
            </p>
          </div>

          {/* ── No location warning ── */}
          {noLocation && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <Info size={16} className="flex-shrink-0" />
              <span>Please select a location to generate a QR code.</span>
            </div>
          )}

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            {/* LEFT — Previews */}
            <div className="space-y-4">
              <QRPreviewCard qrDataUrl={qrDataUrl} generated={generated} />
              <PrintPreviewCard
                qrDataUrl={qrDataUrl}
                pdfSettings={pdfSettings}
                generated={generated}
              />
            </div>

            {/* RIGHT — Settings */}
            <div className="space-y-4">
              <QRSettingsCard
                qrSettings={qrSettings}
                onChange={setQRSettings}
                logoInputRef={logoInputRef}
                onLogoUpload={handleLogoUpload}
                onLogoRemove={() => setLogo(null)}
              />
              <PDFSettingsCard
                pdfSettings={pdfSettings}
                onChange={setPDFSettings}
              />
            </div>
          </div>

          {/* ── Action bar ── */}
          <ActionBar
            noLocation={noLocation}
            generating={generating}
            generated={generated}
            copied={copied}
            onGenerate={handleGenerate}
            onDownloadPNG={handleDownloadPNG}
            onDownloadPDF={handleDownloadPDF}
            onCopy={handleCopy}
          />



        </div>
      </div>
    </TooltipProvider>
  );
}