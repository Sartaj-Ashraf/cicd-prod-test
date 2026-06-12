"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LocationActions from "./LocationActions";
import { Badge } from "@/components/ui/badge";

export default function LocationCard({ location,gbpConnection }: { location: any,gbpConnection:boolean }) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between ">
        <div>
          <CardTitle className="text-sm">
            {location.nickname || location.name}
          </CardTitle>

          {location.nickname && (
            <p className="text-xs text-muted-foreground">
              {location.name} 
            </p>
          )}
        </div>
        {
          gbpConnection?<Badge className="text-green-800">GBP connected</Badge>:<Badge className="text-red-600">GBP not connected</Badge>
        }
        <LocationActions location={location} />

      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          {location.address}
        </p>

      </CardContent>
    </Card>
  );
} 