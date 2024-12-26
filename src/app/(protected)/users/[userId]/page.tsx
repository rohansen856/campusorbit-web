"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader } from "lucide-react"
import { toast } from "sonner"

import { ProfileHeader } from "@/components/user/profile-header"
import { ProfileInfo } from "@/components/user/profile-info"
import { SocialLinks } from "@/components/user/social-links"

export default function UserProfilePage() {
  const { userId } = useParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) throw new Error("Failed to fetch user")
        const data = await response.json()
        setUser(data)
      } catch (error) {
        toast.error("Failed to load user profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) {
    return (
      <div className="pt-36 flex items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </div>
    )
  }

  return (
    <div className="container min-h-screen">
      <ProfileHeader user={user} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileInfo user={user} />
        <SocialLinks socials={user.Socials[0]} />
      </div>
    </div>
  )
}
