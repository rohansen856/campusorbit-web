import { NextRequest, NextResponse } from "next/server"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = 10

    const posts = await db.post.findMany({
      where: {
        userId: user.id,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    const nextCursor = posts[limit - 1]?.id.toString()

    return NextResponse.json({
      posts,
      nextCursor,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
