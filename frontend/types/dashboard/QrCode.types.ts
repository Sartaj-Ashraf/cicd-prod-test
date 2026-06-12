export interface QRTemplate {
  label: string;
  dotColor: string;
  gradient: string;
  title: string;
  subtitle: string;
  footer: string;
  textColor: string; // ✅ ADD THIS (required, not optional)
}

export type QRTemplatesMap = Record<string, QRTemplate>;