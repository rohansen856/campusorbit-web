import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubType = searchParams.get("clubType")
    const search = searchParams.get("search")
    const institute = searchParams.get("institute")

    const where: Prisma.ClubWhereInput = {
      ...(clubType && { clubType }),
      ...(institute && { institute_id: parseInt(institute) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    const clubs = await db.club.findMany({
      where,
      include: {
        _count: { select: { members: true } },
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
