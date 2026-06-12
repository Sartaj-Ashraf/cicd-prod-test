import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "./ColorPicker";
import { QRSettings } from "@/types/dashboard/qr";

interface QRSettingsCardProps {
  qrSettings: QRSettings;
  onChange: (settings: QRSettings) => void;
  logoInputRef: React.RefObject<HTMLInputElement | null>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoRemove: () => void;
}

export function QRSettingsCard({
  qrSettings,
  onChange,
  logoInputRef,
  onLogoUpload,
  onLogoRemove,
}: QRSettingsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          QR Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo upload */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Logo inside QR (optional)</Label>
          {qrSettings.logoDataUrl ? (
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/50">
              <img
                src={qrSettings.logoDataUrl}
                alt="Uploaded logo"
                className="w-9 h-9 rounded object-contain border border-border bg-white"
              />
              <span className="text-xs text-muted-foreground flex-1">Logo uploaded</span>
              <button
                onClick={onLogoRemove}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove logo"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => logoInputRef.current?.click()}
              className="w-full h-14 rounded-lg border border-dashed border-border hover:border-foreground/40 hover:bg-muted/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Upload size={15} />
              Upload logo (PNG / SVG)
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            className="hidden"
            onChange={onLogoUpload}
          />
        </div>

        <Separator />

        <ColorPicker
          label="QR color"
          value={qrSettings.fgColor}
          onChange={(v) => onChange({ ...qrSettings, fgColor: v })}
        />
      </CardContent>
    </Card>
  );
}