import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SegmentedControl } from "./SegmentedControl";
import { PDFSettings, PaperSize, PageQRSize, BorderFrame } from "@/types/dashboard/qr";

interface PDFSettingsCardProps {
  pdfSettings: PDFSettings;
  onChange: (settings: PDFSettings) => void;
}

export function PDFSettingsCard({ pdfSettings, onChange }: PDFSettingsCardProps) {
  const update = <K extends keyof PDFSettings>(key: K, value: PDFSettings[K]) =>
    onChange({ ...pdfSettings, [key]: value });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          PDF Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Title text</Label>
          <Input
            value={pdfSettings.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Scan to rate your experience"
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Subtitle text</Label>
          <Input
            value={pdfSettings.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            placeholder="Your feedback helps us improve"
            className="h-9 text-sm"
          />
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Paper size</Label>
          <SegmentedControl
            options={["A4", "Letter", "A5"] as PaperSize[]}
            value={pdfSettings.paperSize}
            onChange={(v) => update("paperSize", v)}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">QR size on page</Label>
          <SegmentedControl
            options={["Small", "Medium", "Large"] as PageQRSize[]}
            value={pdfSettings.pageQRSize}
            onChange={(v) => update("pageQRSize", v)}
          />
          <p className="text-[11px] text-muted-foreground">
            Small: 60mm · Medium: 100mm · Large: 140mm
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Border frame</Label>
          <SegmentedControl
            options={["None", "Line", "Rounded"] as BorderFrame[]}
            value={pdfSettings.borderFrame}
            onChange={(v) => update("borderFrame", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}