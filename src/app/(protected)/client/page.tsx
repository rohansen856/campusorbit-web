"use client"

import { Computer } from "lucide-react"

import { useCurrentUser } from "@/hooks/use-current-user"
import { UserInfo } from "@/components/user-info"

export default function ClientPage() {
  const user = useCurrentUser()

  return <UserInfo icon={Computer} label="Client component" user={user} />
}
