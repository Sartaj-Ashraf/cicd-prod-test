import { Dispatch, SetStateAction } from "react";
import { Info } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type LocationCardTooltipProps = {
  openInfo: boolean;
  setOpenInfo: Dispatch<SetStateAction<boolean>>;
  isGlobalEnabled: boolean;
};

const LocationCardTooltip = ({
  openInfo,
  setOpenInfo,
  isGlobalEnabled,
}: LocationCardTooltipProps) => {
  return (
    <div
      onMouseEnter={() => setOpenInfo(true)}
      onMouseLeave={() => setOpenInfo(false)}
    >
      <Popover open={openInfo}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Info
              size={13}
              className="text-muted-foreground cursor-pointer"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="left"
          className="max-w-xs text-xs bg-background leading-relaxed p-3 grid gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {!isGlobalEnabled ? (
            <p className="text-muted-foreground">
              Review Guard is currently disabled globally. Enable it from the
              Locations page header to start filtering reviews.
            </p>
          ) : (
            <>
              <p className="text-muted-foreground">
                Customers giving{" "}
                <span className="font-medium text-foreground">
                  4–5 stars
                </span>{" "}
                are redirected to Google to leave a public review.
              </p>

              <p className="text-muted-foreground">
                Customers giving{" "}
                <span className="font-medium text-foreground">
                  1–3 stars
                </span>{" "}
                are redirected to a private feedback form instead.
              </p>

              <div className="border-t pt-2">
                <p className="text-blue-500 font-medium mb-1">
                  Smart Review Balancing
                </p>

                <p className="text-muted-foreground">
                  After every{" "}
                  <span className="font-medium text-foreground">
                    4 privately collected bad reviews
                  </span>
                  , the next unhappy customer is also sent to Google.
                </p>

                <p className="text-muted-foreground mt-1">
                  This keeps your review profile looking more natural and
                  trustworthy instead of showing only perfect ratings.
                </p>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationCardTooltip;