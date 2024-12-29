// types.ts
import { Institute, Socials, Student, User } from "@prisma/client"
import {
  Building,
  Calendar,
  CheckCircle,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Loader,
  MessageCircleHeart,
  Twitter,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "../ui/badge"

export type ExtendedStudent = Student & {
  institute: Institute
  user: User
  Socials: Socials[]
}

export interface UserFiltersType {
  search: string
  branch: string
  semester: string
  instituteId: string
}

export interface UsersResponse {
  users: ExtendedStudent[]
  hasMore: boolean
}

export interface UserResponse {
  user: ExtendedStudent
}

interface UserDetailsProps extends React.HTMLAttributes<typeof Card> {
  user: ExtendedStudent | null
  loading: boolean
}

export function UserDetails({ user, loading, ...props }: UserDetailsProps) {
  if (loading) {
    return (
      <Card className="flex h-[60vh] w-full items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="flex h-[60vh] w-full items-center justify-center">
        <p className="text-muted-foreground">User not found</p>
      </Card>
    )
  }

  return (
    <Card className={cn("h-[60vh] w-full overflow-y-auto", props.className)}>
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: user.background_banner
            ? `url(${user.background_banner})`
            : "linear-gradient(to right, #4f46e5, #3b82f6)",
        }}
      />

      <CardHeader className="relative -mt-12">
        <div className="flex items-end gap-4">
          <Avatar className="border-background size-24 border-4">
            <AvatarImage src={user.profile_image || undefined} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{user.username}</CardTitle>
              {user.verified && (
                <Badge
                  variant={"secondary"}
                  className="border border-green-500 bg-green-500/30"
                >
                  verified
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Building className="text-muted-foreground size-5" />
            <div>
              <p className="text-sm font-medium">Institute</p>
              <p className="text-muted-foreground">
                {user.institute.short_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-muted-foreground size-5" />
            <div>
              <p className="text-sm font-medium">Branch</p>
              <p className="text-muted-foreground">{user.branch}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground size-5" />
            <div>
              <p className="text-sm font-medium">Batch</p>
              <p className="text-muted-foreground">
                {user.enrollment_year} - {user.graduation_year}
              </p>
            </div>
          </div>
        </div>

        {user.Socials.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {user.Socials[0].github && (
                <a
                  href={user.Socials[0].github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Github className="size-5" />
                  <span>GitHub</span>
                </a>
              )}
              {user.Socials[0].linkedin && (
                <a
                  href={user.Socials[0].linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Linkedin className="size-5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {user.Socials[0].twitter && (
                <a
                  href={user.Socials[0].twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Twitter className="size-5" />
                  <span>Twitter</span>
                </a>
              )}
              {user.Socials[0].instagram && (
                <a
                  href={user.Socials[0].instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Instagram className="size-5" />
                  <span>Instagram</span>
                </a>
              )}
              {user.Socials[0].discord && (
                <a
                  href={user.Socials[0].discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <MessageCircleHeart className="size-5" />
                  <span>Discord</span>
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
