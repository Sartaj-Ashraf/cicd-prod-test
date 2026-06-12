import { QrCode, Download, FileText, Copy, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionBarProps {
  noLocation: boolean;
  generating: boolean;
  generated: boolean;
  copied: boolean;
  onGenerate: () => void;
  onDownloadPNG: () => void;
  onDownloadPDF: () => void;
  onCopy: () => void;
}

export function ActionBar({
  noLocation,
  generating,
  generated,
  copied,
  onGenerate,
  onDownloadPNG,
  onDownloadPDF,
  onCopy,
}: ActionBarProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3 items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex-1 sm:flex-none sm:min-w-[160px]">
            <Button
              onClick={onGenerate}
              disabled={noLocation || generating}
              className="w-full gap-2 h-10"
            >
              <QrCode size={16} />
              {generating ? "Generating…" : "Generate QR"}
            </Button>
          </span>
        </TooltipTrigger>
        {noLocation && <TooltipContent>Select a location first</TooltipContent>}
      </Tooltip>

      <Button
        variant="outline"
        onClick={onDownloadPNG}
        disabled={!generated}
        className="gap-2 h-10 flex-1 sm:flex-none"
      >
        <Download size={15} />
        Download PNG
      </Button>

      <Button
        variant="outline"
        onClick={onDownloadPDF}
        disabled={!generated}
        className="gap-2 h-10 flex-1 sm:flex-none"
      >
        <FileText size={15} />
        Download PDF
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            disabled={noLocation}
            className="h-10 w-10 flex-shrink-0"
          >
            {copied ? (
              <CheckCheck size={15} className="text-green-600" />
            ) : (
              <Copy size={15} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy feedback link</TooltipContent>
      </Tooltip>
    </div>
  );
}