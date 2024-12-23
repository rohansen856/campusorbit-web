import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { PostSchemaType } from "@/lib/validation"

const PostSchema = z.object({
  content: z.string().min(1).max(1000),
})

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await req.json()
    const { content } = PostSchema.parse(body)

    const post = await db.post.create({
      data: {
        content,
        userId: user.id,
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get("cursor")
    const limit = 10

    const posts: PostSchemaType[] = await db.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: {
        createdAt: "desc",
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

    const nextCursor = posts[limit - 1]?.id.toString()

    return NextResponse.json({
      posts,
      nextCursor,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
