import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { PostSchemaType } from "@/lib/validation"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const filter = searchParams.get("filter") || "all"

    let results: PostSchemaType[] = []

    switch (filter) {
      case "users":
        results = await db.post.findMany({
          where: {
            user: {
              OR: [
                { username: { contains: query } },
                { user: { name: { contains: query } } },
              ],
            },
          },
          include: {
            user: {
              select: {
                username: true,
                profile_image: true,
                verified: true,
                user: { select: { name: true } },
              },
            },
            likes: {
              where: { userId: user.id },
              distinct: ["userId", "postId"],
              take: 1,
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        })
        break
      case "mentions":
        results = await db.post.findMany({
          where: {
            OR: [
              { content: { contains: `@${query}` } },
              { content: { contains: `#${query}` } },
            ],
          },
          include: {
            user: {
              select: {
                username: true,
                profile_image: true,
                verified: true,
                user: { select: { name: true } },
              },
            },
            likes: {
              where: { userId: user.id },
              distinct: ["userId", "postId"],
              take: 1,
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        })
        break
      default:
        results = await db.post.findMany({
          where: {
            content: { contains: query, mode: "insensitive" },
          },
          include: {
            user: {
              select: {
                username: true,
                profile_image: true,
                verified: true,
                user: { select: { name: true } },
              },
            },
            likes: {
              where: { userId: user.id },
              distinct: ["userId", "postId"],
              take: 1,
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        })
        console.log(query, results.length)
    }
    console.log(filter)

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
