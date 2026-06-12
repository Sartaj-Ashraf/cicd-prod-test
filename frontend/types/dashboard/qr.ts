export type PaperSize = "A4" | "Letter" | "A5";
export type PageQRSize = "Small" | "Medium" | "Large";
export type BorderFrame = "None" | "Line" | "Rounded";

export interface QRSettings {
  fgColor: string;
  logoDataUrl: string | null;
}

export interface PDFSettings {
  title: string;
  subtitle: string;
  paperSize: PaperSize;
  pageQRSize: PageQRSize;
  borderFrame: BorderFrame;
}

// ── Fixed QR render constants ──
export const QR_PX = 300;
export const QR_BG = "#FFFFFF";
export const QR_ECL = "H" as const;

// ── Paper dimensions in mm ──
export const PAPER_MM: Record<PaperSize, [number, number]> = {
  A4: [210, 297],
  Letter: [215.9, 279.4],
  A5: [148, 210],
};

// ── QR size on page in mm ──
export const PAGE_QR_MM: Record<PageQRSize, number> = {
  Small: 60,
  Medium: 100,
  Large: 140,
};

export const DEFAULT_QR_SETTINGS: QRSettings = {
  fgColor: "#000000",
  logoDataUrl: null,
};

export const DEFAULT_PDF_SETTINGS: PDFSettings = {
  title: "Scan to rate your experience",
  subtitle: "Your feedback helps us improve",
  paperSize: "A4",
  pageQRSize: "Medium",
  borderFrame: "Rounded",
};