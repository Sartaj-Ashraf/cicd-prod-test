import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintPreview } from "./PrintPreview";
import { PDFSettings } from "@/types/dashboard/qr";

interface PrintPreviewCardProps {
  qrDataUrl: string | null;
  pdfSettings: PDFSettings;
  generated: boolean;
}

export function PrintPreviewCard({ qrDataUrl, pdfSettings, generated }: PrintPreviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Print Preview
          </CardTitle>
          <span className="text-[10px] text-muted-foreground">Exactly what will print</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full py-2">
          <PrintPreview
            qrDataUrl={qrDataUrl}
            pdfSettings={pdfSettings}
            generated={generated}
          />
        </div>
        <div className="flex items-start gap-1.5 mt-3">
          <Info size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Updates live as you edit settings. PDF exports as vector — prints sharp at any size.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}