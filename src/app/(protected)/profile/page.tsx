import { currentUser } from "@/lib/authentication"
import Image from "next/image"
import Link from "next/link"

export default async function ProfilePage() {
    const user = await currentUser()
    if (!user) return null
    return (
        <div className="w-full flex gap-8">
            <div className="w-3/5 min-h-[500px]">
                <div className="h-full max-h-[250px] bg-secondary rounded-lg"></div>
                <div className="flex justify-between px-12 mt-2">
                    <div className="size-36 rounded-full bg-blue-500 -mt-16"></div>
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
            </div>
            <div className="hidden md:block w-2/5 h-40 bg-secondary">
                <h2>{user.name}</h2>
            </div>
        </div>
    )
}
