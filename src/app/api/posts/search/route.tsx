import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")?.toLowerCase() || ""
    const filter = searchParams.get("filter") || "all"

    let results = []

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
            user: { select: { username: true } },
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
            user: { select: { username: true } },
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
            user: { select: { username: true } },
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

    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
