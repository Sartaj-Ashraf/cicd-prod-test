import { QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QRPreviewCardProps {
  qrDataUrl: string | null;
  generated: boolean;
}

export function QRPreviewCard({ qrDataUrl, generated }: QRPreviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          QR Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="w-44 h-44 sm:w-52 sm:h-52 relative rounded-xl border border-border bg-white flex items-center justify-center overflow-hidden">
            {generated && qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                <QrCode size={60} />
                <span className="text-xs">Not generated yet</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <Badge
              variant="secondary"
              className="text-[11px] bg-blue-50 text-blue-700 border-transparent dark:bg-blue-950 dark:text-blue-300"
            >
              ECL: H (High)
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              300 × 300 px
            </Badge>
            <Badge variant="secondary" className="text-[11px]">
              White background
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}