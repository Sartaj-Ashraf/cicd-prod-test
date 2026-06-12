"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function LocationSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">

        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-24 bg-muted rounded animate-pulse" />

        <div className="h-8 w-20 bg-muted rounded animate-pulse" />

      </CardContent>
    </Card>
  );
}