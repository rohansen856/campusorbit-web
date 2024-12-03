"use client"

import Link from "next/link"
import { Institute, Student, User } from "@prisma/client"
import { motion } from "framer-motion"
import { Heart, User as UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { Badge } from "../ui/badge"

interface UserListItemProps {
  user: Student & { institute: Institute } & { user: User }
  index: number
}

const getInstituteColor = (affiliation: string) => {
  if (affiliation === "IIT") return "from-blue-500/10 to-indigo-500/10"
  if (affiliation === "IIIT") return "from-purple-500/10 to-pink-500/10"
  if (affiliation === "NIT") return "from-green-500/10 to-emerald-500/10"
  return "from-gray-500/10 to-slate-500/10"
}

export function UserListItem({ user, index }: UserListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/users?userId=${user.user_id}`}>
        <div
          className={`
          p-4 rounded-lg backdrop-blur-sm bg-gradient-to-r 
          ${getInstituteColor(user.institute.affiliation)}
          hover:shadow-lg transition-all duration-300
          border border-primary/10
        `}
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border border-primary/30">
              <AvatarImage src={user.profile_image || "/shield-check.png"} />
              <AvatarFallback>
                <UserIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold">
                {user.user.name}{" "}
                {user.graduation_year > new Date().getFullYear() && (
                  <Badge
                    variant={"outline"}
                    className="ml-2 border-red-900 bg-red-900/10"
                  >
                    alumni
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{user.institute.short_name}</span>
                <span>•</span>
                <span>{user.branch}</span>
                <span>•</span>
                <span>sem {user.semester}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault()
                // Add friend logic here
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
