"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (isPending) {
      return
    }

    if (!session) {
      router.replace("/login")
      return
    }

    const role =
      session.user && "role" in session.user
        ? String(session.user.role)
        : "user"

    if (role !== "admin") {
      authClient.signOut().finally(() => {
        router.replace("/login")
      })
    }
  }, [isPending, session, router])

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Loading admin session...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const role =
    session.user && "role" in session.user
      ? String(session.user.role)
      : "user"

  if (role !== "admin") {
    return null
  }

  const { user } = session

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Signed in administrator details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {role}
            </p>
            <p>
              <span className="font-medium">User ID:</span> {user.id}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await authClient.signOut()
              router.replace("/login")
              router.refresh()
            }}
          >
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
