import { Card, CardContent } from "@/components/ui/card";

export default function FeedbackCardSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-4 grid gap-3 animate-pulse">

            {/* header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="w-3.5 h-3.5 rounded-sm bg-gray-200" />
                  ))}
                </div>
                <div className="h-3 w-20 bg-gray-200 rounded-md" />
              </div>
              <div className="h-5 w-12 bg-gray-200 rounded-full" />
            </div>

            {/* contact pills */}
            <div className="flex gap-2">
              <div className="h-7 w-24 bg-gray-200 rounded-lg" />
              <div className="h-7 w-28 bg-gray-200 rounded-lg" />
            </div>

            {/* question rows */}
            <div className="grid gap-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="h-3 w-32 bg-gray-200 rounded-md" />
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div key={s} className="w-3.5 h-3.5 rounded-sm bg-gray-200" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* comment */}
            <div className="bg-gray-50 rounded-lg p-3 grid gap-1.5">
              <div className="h-3 w-full bg-gray-200 rounded-md" />
              <div className="h-3 w-4/5 bg-gray-200 rounded-md" />
              <div className="h-3 w-3/5 bg-gray-200 rounded-md" />
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}