import jsPDF from "jspdf";
import logo from "@/public/MangoLogo.png";
import { PDFSettings, PAPER_MM, PAGE_QR_MM, QR_PX, QR_BG, QR_ECL  } from "../../types/dashboard/qr";
import QRCode from "qrcode";


export async function downloadQRAsPDF(
  qrDataUrl: string,
  pdfSettings: PDFSettings,
  filenameSuffix: string
): Promise<void> {
  const [pageW, pageH] = PAPER_MM[pdfSettings.paperSize];
  const qrMm = PAGE_QR_MM[pdfSettings.pageQRSize];
  const centerX = pageW / 2;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: pdfSettings.paperSize.toLowerCase() as "a4" | "letter" | "a5",
  });

  // Pre-fetch the logo so we can measure its aspect ratio for layout.
  const logoB64 = await fetchImageAsBase64(logo.src).catch(() => null);
  const logoH = 4;
  const logoW = logoB64 ? (logo.width / logo.height) * logoH : 0;

  drawBorderFrame(pdf, pdfSettings, centerX, pageH, qrMm, logoH);

  const startY = layoutContentY(pdfSettings, pageH, qrMm, logoH);
  let y = startY;

  y = drawTitle(pdf, pdfSettings.title, centerX, y, qrMm);
  drawQRImage(pdf, qrDataUrl, centerX, y, qrMm);
  y += qrMm + 6;
  y = drawSubtitle(pdf, pdfSettings.subtitle, centerX, y, qrMm);

  // "Powered by" + logo inline, right after subtitle.
  await drawPoweredBy(pdf, centerX, y, logoB64, logoW, logoH);

  pdf.save(`qr-feedback-${filenameSuffix}.pdf`);
}

// ── Private helpers ──────────────────────────────────────────────────────────

const POWERED_BY_H = 8; // mm reserved for the powered-by row

function drawBorderFrame(
  pdf: jsPDF,
  settings: PDFSettings,
  centerX: number,
  pageH: number,
  qrMm: number,
  logoH: number
): void {
  if (settings.borderFrame === "None") return;

  const pad = 12;
  const titleH = settings.title ? 14 : 0;
  const subH = settings.subtitle ? 10 : 0;
  const totalH = titleH + qrMm + subH + POWERED_BY_H + pad * 2;
  const frameW = qrMm + pad * 2;
  const frameX = centerX - frameW / 2;
  const frameY = (pageH - totalH) / 2;

  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);

  if (settings.borderFrame === "Rounded") {
    pdf.roundedRect(frameX, frameY, frameW, totalH, 4, 4);
  } else {
    pdf.rect(frameX, frameY, frameW, totalH);
  }
}

function layoutContentY(
  settings: PDFSettings,
  pageH: number,
  qrMm: number,
  logoH: number
): number {
  const titleH = settings.title ? 14 : 0;
  const subH = settings.subtitle ? 10 : 0;
  return (pageH - (titleH + qrMm + subH + POWERED_BY_H)) / 2;
}

/** Draws the title and returns the updated Y cursor. */
function drawTitle(
  pdf: jsPDF,
  title: string,
  centerX: number,
  y: number,
  qrMm: number
): number {
  if (!title) return y;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(20, 20, 20);
  const lines = pdf.splitTextToSize(title, qrMm + 10);
  pdf.text(lines, centerX, y + 8, { align: "center" });
  return y + 14;
}

function drawQRImage(
  pdf: jsPDF,
  qrDataUrl: string,
  centerX: number,
  y: number,
  qrMm: number
): void {
  pdf.addImage(qrDataUrl, "PNG", centerX - qrMm / 2, y, qrMm, qrMm);
}

/** Draws the subtitle and returns the updated Y cursor. */
function drawSubtitle(
  pdf: jsPDF,
  subtitle: string,
  centerX: number,
  y: number,
  qrMm: number
): number {
  if (!subtitle) return y;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(120, 120, 120);
  const lines = pdf.splitTextToSize(subtitle, qrMm + 10);
  pdf.text(lines, centerX, y, { align: "center" });
  return y + 10;
}

/** Draws "Powered by <logo>" centred, inline right after the subtitle. */
async function drawPoweredBy(
  pdf: jsPDF,
  centerX: number,
  y: number,
  logoB64: string | null,
  logoW: number,
  logoH: number
): Promise<void> {
  const gap = 1.5; // mm between text and logo
  const textLabel = "Powered by";

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(160, 160, 160);

  // Measure the text width so we can centre the whole row.
  const textW = pdf.getTextWidth(textLabel);
  const rowW = textW + gap + logoW;
  const rowX = centerX - rowW / 2;

  // Baseline for text — align with vertical centre of logo.
  const textY = y + logoH * 0.75;

  pdf.text(textLabel, rowX, textY);

  if (logoB64) {
    pdf.addImage(logoB64, "PNG", rowX + textW + gap, y, logoW, logoH);
  }
}

async function fetchImageAsBase64(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateQRDataURL(
  value: string,
  fgColor: string,
  logoDataUrl: string | null
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = QR_PX;
  canvas.height = QR_PX;

  await QRCode.toCanvas(canvas, value, {
    width: QR_PX,
    margin: 2,
    errorCorrectionLevel: QR_ECL,
    color: { dark: fgColor, light: QR_BG },
  });

  if (logoDataUrl) {
    await embedLogoOnCanvas(canvas, logoDataUrl);
  }

  return canvas.toDataURL("image/png");
}

async function embedLogoOnCanvas(
  canvas: HTMLCanvasElement,
  logoDataUrl: string
): Promise<void> {
  const ctx = canvas.getContext("2d")!;

  const img = await loadImage(logoDataUrl);

  const logoSize = QR_PX * 0.22;
  const logoX = (QR_PX - logoSize) / 2;
  const logoY = (QR_PX - logoSize) / 2;
  const pad = 6;

  // White backing square
  ctx.fillStyle = QR_BG;
  ctx.beginPath();
  ctx.roundRect(
    logoX - pad,
    logoY - pad,
    logoSize + pad * 2,
    logoSize + pad * 2,
    6
  );
  ctx.fill();

  ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}