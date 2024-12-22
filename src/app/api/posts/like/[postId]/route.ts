// app/api/posts/[postId]/like/route.ts
import { NextResponse } from "next/server"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await currentUser()
    const postId = parseInt(params.postId)

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!postId || isNaN(postId)) {
      return new NextResponse("Invalid post ID", { status: 400 })
    }

    // Check if post exists
    const post = await db.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return new NextResponse("Post not found", { status: 404 })
    }

    const existingLike = await db.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: user.id,
        },
      },
    })

    let like, status
    if (existingLike) {
      // Unlike the post
      like = await db.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: user.id,
          },
        },
      })
      status = 200
    } else {
      // Like the post
      like = await db.like.create({
        data: {
          postId,
          userId: user.id,
        },
      })
      status = 202
    }

    return NextResponse.json(like, { status })
  } catch (error) {
    console.error("[POST_LIKE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

// Get like status and count for a post
export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const user = await currentUser()
    const postId = parseInt(params.postId)

    if (!postId || isNaN(postId)) {
      return new NextResponse("Invalid post ID", { status: 400 })
    }

    const [likeCount, userLike] = await Promise.all([
      // Get total likes for the post
      db.like.count({
        where: { postId },
      }),
      // Check if current user liked the post
      user
        ? db.like.findUnique({
            where: {
              postId_userId: {
                postId,
                userId: user.id,
              },
            },
          })
        : null,
    ])

    return NextResponse.json({
      likeCount,
      isLiked: !!userLike,
    })
  } catch (error) {
    console.error("[GET_LIKE]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
