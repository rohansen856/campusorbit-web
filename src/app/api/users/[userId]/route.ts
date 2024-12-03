// app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/lib/db"

interface Params {
  params: {
    userId: string
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { userId } = params

    const user = await db.student.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        institute: true,
        user: { select: { email: true, name: true } },
        Socials: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
