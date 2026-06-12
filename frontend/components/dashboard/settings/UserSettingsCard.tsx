"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ChangePasswordForm from "@/components/auth/ChangePasswordForm"
import EditProfile from "@/components/auth/EditProfile"
import { queryClient } from "@/utils/query-client"
import { queryKeys } from "@/lib/query-keys"
import { MeResponse } from "@/types/auth/auth.types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"

const UserSettingsCard = () => {
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)

  const data = queryClient.getQueryData(queryKeys.auth.me) as MeResponse

  return (
    <>
      {/* Card */}
      <Card >
        <CardHeader>
          <CardTitle className="text-xl ">User</CardTitle>
          <CardDescription >
            Account actions password and profile
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          {data?.user?.provider === "local" && (
            <Button
              className="py-5 bg-mango-orange cursor-pointer"
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </Button>
          )}

          <Button
            onClick={() => setShowEditProfile(true)}
            className="py-5 bg-leaf-dark cursor-pointer"
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowChangePassword(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowChangePassword(false)}
              className="absolute right-4 top-4 text-xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>

            <ChangePasswordForm />
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEditProfile(false)}
              className="absolute right-4 top-4 text-xl text-muted-foreground hover:text-foreground"
            >
              ×
            </button>

            <EditProfile  onClose={() => setShowEditProfile(false)} />
          </div>
        </div>
      )}
    </>
  )
}

export default UserSettingsCard