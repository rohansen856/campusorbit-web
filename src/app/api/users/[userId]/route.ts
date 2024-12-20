import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await db.student.findFirst({
      where: { user_id: params.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        institute: true,
        Socials: true,
        ClubMember: {
          include: {
            club: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    console.log(user)

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
