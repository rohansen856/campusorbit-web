import { Server } from "lucide-react"

import { currentUser } from "@/lib/authentication"
import { UserInfo } from "@/components/user-info"

export default async function ServerPage() {
  const user = await currentUser()

  return <UserInfo icon={Server} label="Server component" user={user} />
}
