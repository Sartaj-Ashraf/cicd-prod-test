import QRCodeStyling from "qr-code-styling";
import { toPng } from "html-to-image";
import defaultLogo from "@/public/logo.png";

export interface GenerateQRParams {
  value: string;
  size?: number;
  logo?: string; // optional override
}

export const generateQRCode = async ({
  value,
  size = 300,
  logo,
}: GenerateQRParams): Promise<string> => {
  if (!value.trim()) throw new Error("QR value is empty");

  const qr = new QRCodeStyling({
    width: size,
    height: size,
    data: value,

    // ✅ use passed logo OR fallback to default
    image: logo || defaultLogo.src,

    dotsOptions: {
      color: "#000000",
      type: "rounded",
    },

    backgroundOptions: {
      color: "#ffffff",
    },

    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.25, // safe size (don’t increase blindly)
    },
  });

  const blob = await qr.getRawData("png");

  return new Promise((resolve, reject) => {
    if (!blob) return reject("Failed to generate QR");

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob as Blob);
  });
};
export const downloadQRCodePNG = async ({
  value,
  size = 300,
  logo,
  fileName = "qr-code.png",
}: GenerateQRParams & { fileName?: string }) => {
  if (!value.trim()) throw new Error("QR value is empty");

  const qr = new QRCodeStyling({
    width: size,
    height: size,
    data: value,
    image: logo || defaultLogo.src,
    dotsOptions: {
      color: "#000000",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.25,
    },
  });

  const blob = await qr.getRawData("png");

  if (!blob) throw new Error("Failed to generate QR");

  const url = URL.createObjectURL(blob as Blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();                               

  URL.revokeObjectURL(url);
};
export const downloadElementAsImage = async (
  element: HTMLElement,
  fileName: string
  
): Promise<void> => {
  downloadQRCodePNG({
    value: element.innerHTML,
    size: 300,
    logo: defaultLogo.src,
    fileName: fileName,
  });
  if (!element) throw new Error("Element not found");

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 3, // high quality export
  });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};