import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LocationGlobalTooltip = () => {
  return (
        <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Info size={14} className="text-muted-foreground cursor-pointer" />
    </TooltipTrigger>

    <TooltipContent
      side="bottom"
      className="bg-background border md:min-w-xl p-3 grid leading-relaxed"
    >
      <p className="font-semibold text-leaf-dark text-sm mb-1">Review Guard</p>

      <p className="text-xs text-muted-foreground mb-1">
        Customers who leave{" "}
        <span className=" font-bold  text-accent-foreground">4–5 star ratings</span>{" "}
        are encouraged to post their review publicly on Google to help improve
        your online reputation.
      </p>

      <p className="text-xs text-muted-foreground mb-2">
        Customers who leave{" "}
        <span className="text-accent-foreground font-bold">1–3 star ratings</span>{" "}
        are redirected to a private feedback form instead, allowing you to
        resolve issues internally before they become public reviews.
      </p>

      <div className="border-t pt-2 mt-2">
        <p className="text-xs font-medium text-blue-500 mb-1">
          Smart Natural Review Flow
        </p>

        <p className="text-xs text-muted-foreground">
          By default, after every{" "}
          <span className="text-accent-foreground font-medium">
            4 privately collected bad reviews
          </span>
          , the next unhappy customer is also sent to Google.
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          This creates a more{" "}
          <span className="text-accent-foreground font-medium">
            natural and trustworthy review pattern
          </span>{" "}
          since profiles with only perfect reviews can sometimes appear
          suspicious or manipulated.
        </p>
      </div>

      <div className="border-t pt-2 mt-2">
        <p className="text-xs font-medium text-amber-500 mb-1">
          ⚠️ If Disabled
        </p>

        <p className="text-xs text-muted-foreground">
          When disabled, this balancing behavior stops completely.
        </p>

        <p className="text-xs text-muted-foreground mt-2">
          All customers giving{" "}
          <span className="text-accent-foreground font-medium">1–3 star ratings</span>{" "}
          will always be filtered into the private feedback form and{" "}
          <span className="text-accent-foreground font-medium">
            none will be sent to Google
          </span>
          .
        </p>
      </div>

      <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
        Global setting — applies to all locations. Can also be managed per
        location.
      </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
  )
}
export default LocationGlobalTooltip