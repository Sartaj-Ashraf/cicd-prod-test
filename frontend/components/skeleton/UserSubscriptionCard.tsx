"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SubscriptionItemSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-4 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
        </div>

        {/* Billing Info */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
        </div>

        {/* Usage bars */}
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              <div className="h-3 w-12 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-2 w-full rounded bg-muted animate-pulse" />
          </div>
        ))}

        {/* Button */}
        <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
      </CardContent>
    </Card>
  )
}

export default function UserSubscriptionCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 w-40 rounded bg-muted animate-pulse mb-2" />
        <div className="h-4 w-64 rounded bg-muted animate-pulse" />
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <SubscriptionItemSkeleton />
          <SubscriptionItemSkeleton />
        </div>
      </CardContent>
    </Card>
  )
}