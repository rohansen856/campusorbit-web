// app/api/trending/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"
import { postSchema } from "@/lib/validation"

// Response schema for validation
const trendingResponseSchema = z.object({
  year: z.array(postSchema),
  month: z.array(postSchema),
  week: z.array(postSchema),
  day: z.array(postSchema),
})

export async function GET() {
  try {
    // Get current date
    const now = new Date()

    // Start of periods
    const startOfDay = new Date(now.setHours(0, 0, 0, 0))
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    // Common select object
    const select = {
      id: true,
      userId: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          profile_image: true,
          verified: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      likes: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    }

    // Fetch posts for different time periods
    const [yearlyPosts, monthlyPosts, weeklyPosts, dailyPosts] =
      await Promise.all([
        // Yearly trending posts
        db.post.findMany({
          where: {
            createdAt: {
              gte: startOfYear,
            },
          },
          select,
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
          take: 5,
        }),

        // Monthly trending posts
        db.post.findMany({
          where: {
            createdAt: {
              gte: startOfMonth,
            },
          },
          select,
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
          take: 5,
        }),

        // Weekly trending posts
        db.post.findMany({
          where: {
            createdAt: {
              gte: startOfWeek,
            },
          },
          select,
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
          take: 5,
        }),

        // Daily trending posts
        db.post.findMany({
          where: {
            createdAt: {
              gte: startOfDay,
            },
          },
          select,
          orderBy: {
            likes: {
              _count: "desc",
            },
          },
          take: 5,
        }),
      ])

    const response = {
      year: yearlyPosts,
      month: monthlyPosts,
      week: weeklyPosts,
      day: dailyPosts,
    }

    // Validate response against schema
    const validatedResponse = trendingResponseSchema.parse(response)

    return NextResponse.json(validatedResponse, { status: 200 })
  } catch (error) {
    console.error("Error fetching trending posts:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data validation error", details: error.errors },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Optional: Add caching headers to improve performance
export const revalidate = 3600 // Revalidate every hour
