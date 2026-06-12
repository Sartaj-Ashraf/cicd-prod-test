"use client"

import UserSubscriptionsCard from "@/components/dashboard/settings/UserSubscriptionCard"
import { useMySubscriptions } from "@/hooks/subscription.hook"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import UserSubscriptionCardSkeleton from "@/components/skeleton/UserSubscriptionCard"

const Page = () => {
  const { data, isLoading } = useMySubscriptions()
  const router = useRouter()
  const subscriptions = data?.subscriptions || []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto bg-card p-4 md:p-8 gap-4 grid">

        {isLoading ? (
          <UserSubscriptionCardSkeleton />
        ) : !subscriptions.length ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h3 className="font-semibold text-base">
                No subscriptions found
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                You don't have any active or past subscriptions yet.
              </p>

              <Button
                className="bg-mango-orange mt-4 rounded-md"
                onClick={() => router.push("/pricing")}
              >
                View Pricing
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="md:mb-4">
              <h4 className="font-bold">User Subscriptions</h4>

              <p className="text-sm text-muted-foreground mt-2">
                Manage your subscriptions
              </p>
            </div>

            <UserSubscriptionsCard />
          </>
        )}

      </div>
    </div>
  )
}

export default Page