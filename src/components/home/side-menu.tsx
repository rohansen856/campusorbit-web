"use client"

import Link from "next/link"
import { CheckCircle2, Edit, Edit2, Settings } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "../ui/button"

export function SideMenuSection() {
  return (
    <div className="hidden w-96 lg:flex flex-col gap-2 h-[80vh]">
      <Link
        href={"/dashboard"}
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        Class Schedules
      </Link>
      <Link
        href={"/clubs"}
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        View Clubs
      </Link>
      <Link
        href={"/users"}
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        Find Users
      </Link>
      <Link
        href={"/posts/trending"}
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        Trending Posts
      </Link>
      <Link
        href={"/posts"}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "w-full mt-auto"
        )}
      >
        <Edit className="size-6" />
        My Posts
      </Link>
      <Link
        href={"/posts/new"}
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        <Edit2 className="size-6" />
        Create Post
      </Link>
      <Link
        href={"/"}
        className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
      >
        <Settings className="size-6" />
        Settings
      </Link>
      <Button
        variant="secondary"
        className="w-full bg-green-700/30 hover:bg-green-700/50 border-green-700 text-green-700"
      >
        <CheckCircle2 />
        Verified
      </Button>
    </div>
  )
}
