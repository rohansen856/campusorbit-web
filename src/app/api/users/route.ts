import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"

const ITEMS_PER_PAGE = 10

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const branch = searchParams.get("branch")
    const semester = searchParams.get("semester")
    const instituteId = searchParams.get("instituteId")

    const where: Prisma.StudentWhereInput = {
      OR: [
        { username: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ],
      ...(branch && { branch }),
      ...(semester && { semester: parseInt(semester) }),
      ...(instituteId && { institute_id: parseInt(instituteId) }),
    }

    const [users, total] = await Promise.all([
      db.student.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          institute: {
            select: {
              name: true,
              short_name: true,
              affiliation: true,
              logo_url: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: ITEMS_PER_PAGE,
        skip: (page - 1) * ITEMS_PER_PAGE,
      }),
      db.student.count({ where }),
    ])

    return NextResponse.json({
      users,
      total,
      hasMore: total > page * ITEMS_PER_PAGE,
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
