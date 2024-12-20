import Image from "next/image"
import Link from "next/link"
import { Socials } from "@prisma/client"

import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { FileUploadModal } from "@/components/settings/upload-profile-image"

interface ProfileSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  user: { id: string; name: string }
  student: {
    profile_image?: string | null
    background_banner?: string | null
    username: string
    verified: boolean
    institute: {
      name: string
      website_url: string
    }
  }
  socials: Socials | null
}

export async function ProfileSection({
  user,
  student,
  socials,
  ...props
}: ProfileSectionProps) {
  return (
    <section className="w-full md:w-3/5 min-h-[500px]">
      <div className="relative h-full max-h-[250px] min-h-[300px] bg-secondary border border-primary/30 overflow-hidden rounded-lg">
        <Image
          src={student.background_banner || "/banner-default.png"}
          alt=""
          fill
          className="object-cover"
        />
        <FileUploadModal imageFor="banner" />
      </div>
      <div className="flex justify-between gap-4 px-12 mt-2 mb-4">
        <div className="relative size-16 md:size-28 xl:size-36 rounded-full bg-secondary -mt-16">
          <div className="size-full rounded-full relative border border-primary/30 overflow-hidden">
            <Image
              src={student.profile_image || "/shield-check.png"}
              alt={student.username[0]}
              fill
              className="object-cover"
            />
          </div>
          <FileUploadModal imageFor="profile" />
        </div>
        <div className="relative flex gap-4">
          <Link
            href={socials?.linkedin ? socials.linkedin : "/settings"}
            className={cn(
              "size-8 md:size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative",
              !socials?.linkedin && "cursor-not-allowed"
            )}
          >
            <Image
              src={"/social/linkedin.svg"}
              alt="in"
              fill
              className="object-cover"
            />
          </Link>
          <Link
            href={socials?.discord ? socials.discord : "/settings"}
            className={cn(
              "size-8 md:size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative",
              !socials?.discord && "cursor-not-allowed"
            )}
          >
            <Image
              src={"/social/discord.svg"}
              alt="in"
              fill
              className="object-contain"
            />
          </Link>
          <Link
            href={socials?.instagram ? socials.instagram : "/settings"}
            className={cn(
              "size-8 md:size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative",
              !socials?.instagram && "cursor-not-allowed"
            )}
          >
            <Image
              src={"/social/instagram.svg"}
              alt="in"
              fill
              className="object-cover"
            />
          </Link>
          <Link
            href={socials?.twitter ? socials.twitter : "/settings"}
            className={cn(
              "size-8 md:size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative",
              !socials?.twitter && "cursor-not-allowed"
            )}
          >
            <Image
              src={"/social/twitter.svg"}
              alt="in"
              fill
              className="object-cover"
            />
          </Link>
          <Link
            href={socials?.github ? socials.github : "/settings"}
            className={cn(
              "size-8 md:size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative",
              !socials?.github && "cursor-not-allowed"
            )}
          >
            <Image
              src={"/social/github.svg"}
              alt="in"
              fill
              className="object-cover"
            />
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h2 className="font-bold text-3xl max-w-full text-ellipsis flex gap-4 items-center">
          {user.name}{" "}
          <Badge
            variant={"secondary"}
            className={cn(
              "border cursor-pointer",
              student.verified
                ? "bg-green-500/30 border-green-500"
                : "bg-red-500/30 border-red-500"
            )}
          >
            {student.verified ? "verified" : "unverified"}
          </Badge>
        </h2>
        <p className="mb-2">@{student.username}</p>
        <Link
          href={student.institute.website_url}
          target="_blank"
          className="text-xl hover:underline hover:text-blue-600"
        >
          {student.institute.name}
        </Link>
      </div>
    </section>
  )
}
