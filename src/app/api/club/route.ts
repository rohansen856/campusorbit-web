import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")

    const where = {
      ...(type && { type }),
      ...(search && {
        OR: [
          //   { name: { contains: search, mode: "insensitive" } },
          //   { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const clubs = await db.club.findMany({
      where,
      include: {
        members: {
          take: 3, // Preview first 3 members
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(clubs)
  } catch (error) {
    console.error("Failed to fetch clubs:", error)
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 }
    )
  }
}
