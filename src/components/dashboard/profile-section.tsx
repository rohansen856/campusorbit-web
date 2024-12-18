import { FileUploadModal } from "@/components/dashboard/upload-profile-image"
import { Badge } from "@/components/ui/badge"
import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProfileSectionProps extends React.HTMLAttributes<HTMLDivElement> {
    user: { name: string }
    student: {
        profile_image?: string | null
        username: string
        verified: boolean
        institute: {
            name: string
            website_url: string
        }
    }
}

export async function ProfileSection({
    user,
    student,
    ...props
}: ProfileSectionProps) {
    return (
        <section className="w-full md:w-3/5 min-h-[500px]">
            <div className="relative h-full max-h-[250px] min-h-[300px] bg-secondary rounded-lg">
                <FileUploadModal />
            </div>
            <div className="flex justify-between gap-4 px-12 mt-2 mb-4">
                <div className="relative border border-primary/30 size-36 rounded-full bg-secondary -mt-16">
                    <div className="size-full relative overflow-hidden">
                        <Image
                            src={student.profile_image || "/shield-check.png"}
                            alt={student.username[0]}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <FileUploadModal />
                </div>
                <div className="relative flex gap-4">
                    <Link
                        href={"/"}
                        className="size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative"
                    >
                        <Image
                            src={"/social/linkedin.svg"}
                            alt="in"
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <Link
                        href={"/"}
                        className="size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative"
                    >
                        <Image
                            src={"/social/discord.svg"}
                            alt="in"
                            fill
                            className="object-contain"
                        />
                    </Link>
                    <Link
                        href={"/"}
                        className="size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative"
                    >
                        <Image
                            src={"/social/instagram.svg"}
                            alt="in"
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <Link
                        href={"/"}
                        className="size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative"
                    >
                        <Image
                            src={"/social/twitter.svg"}
                            alt="in"
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <Link
                        href={"/"}
                        className="size-12 border overflow-hidden rounded-full border-primary/20 bg-secondary relative"
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
