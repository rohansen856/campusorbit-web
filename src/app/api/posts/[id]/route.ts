import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"

const PostUpdateSchema = z.object({
  content: z.string().min(1).max(500),
})

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    await db.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { content } = PostUpdateSchema.parse(body)
    const postId = parseInt(params.id)

    const post = await db.post.update({
      where: { id: postId },
      data: { content },
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

    return NextResponse.json(post)
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    )
  }
}
