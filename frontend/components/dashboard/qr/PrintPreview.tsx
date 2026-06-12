"use client";

import { useRef, useState, useEffect } from "react";
import { QrCode } from "lucide-react";
import logo from "@/public/MangoLogo.png";
import { PDFSettings, PAPER_MM, PAGE_QR_MM } from "@/types/dashboard/qr";

// Maximum width the preview will ever grow to (px), keeps it from
// becoming comically large on wide screens.
const MAX_PREVIEW_W = 380;

interface PrintPreviewProps {
  qrDataUrl: string | null;
  pdfSettings: PDFSettings;
  generated: boolean;
}

export function PrintPreview({ qrDataUrl, pdfSettings, generated }: PrintPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  // Measure the wrapper width and keep it in sync on resize.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observe = () =>
      setContainerW(Math.min(el.clientWidth, MAX_PREVIEW_W));

    observe();
    const ro = new ResizeObserver(observe);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [paperW, paperH] = PAPER_MM[pdfSettings.paperSize];
  const qrMm = PAGE_QR_MM[pdfSettings.pageQRSize];

  // Derive scale so the paper fills the available width.
  const scale = containerW > 0 ? containerW / paperW : 0;

  const previewW = paperW * scale;
  const previewH = paperH * scale;
  const previewQR = qrMm * scale;

  const borderStyle: React.CSSProperties =
    pdfSettings.borderFrame === "None"
      ? {}
      : pdfSettings.borderFrame === "Line"
      ? { border: "0.5px solid #ccc" }
      : { border: "0.5px solid #ccc", borderRadius: 6 };

  return (
    // Full-width wrapper — the ref lets us read the available pixels.
    <div ref={containerRef} className="w-full flex flex-col items-center gap-2">
      {scale > 0 && (
        <>
          <div
            className="bg-white shadow-md flex flex-col items-center justify-center gap-2"
            style={{
              width: previewW,
              height: previewH,
              padding: `${14 * scale}px ${18 * scale}px`,
              ...borderStyle,
            }}
          >
            {pdfSettings.title && (
              <p
                className="text-center font-semibold leading-snug text-gray-900"
                style={{ fontSize: 9 * scale, maxWidth: previewW - 28, margin: 0 }}
              >
                {pdfSettings.title}
              </p>
            )}

            <div
              className="bg-white flex items-center justify-center flex-shrink-0"
              style={{ width: previewQR, height: previewQR }}
            >
              {generated && qrDataUrl ? (
                <img src={qrDataUrl} alt="QR" style={{ width: previewQR, height: previewQR }} />
              ) : (
                <div
                  className="flex items-center justify-center border border-dashed border-gray-200 text-gray-200"
                  style={{ width: previewQR, height: previewQR }}
                >
                  <QrCode size={previewQR * 0.4} />
                </div>
              )}
            </div>

            {pdfSettings.subtitle && (
              <p
                className="text-center text-gray-400 leading-snug"
                style={{ fontSize: 6.5 * scale, maxWidth: previewW - 28, margin: 0 }}
              >
                {pdfSettings.subtitle}
              </p>
            )}

            {/* Powered by — logo only, no brand text */}
            <div className="flex items-center justify-center gap-1">
              <span style={{ fontSize: 5 * scale, color: "#aaa" }}>Powered by</span>
              <img
                src={logo.src}
                alt="Mango Review"
                style={{ height: 7 * scale, width: "auto", objectFit: "contain" }}
              />
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">
            {pdfSettings.paperSize} · {pdfSettings.pageQRSize} QR ·{" "}
            {pdfSettings.borderFrame === "None" ? "No border" : `${pdfSettings.borderFrame} border`}
          </p>
        </>
      )}
    </div>
  );
}