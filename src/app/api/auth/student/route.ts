import { NextResponse } from "next/server"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { socialsSchema, studentSchema } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Signup and login first to register" },
        { status: 403 }
      )
    }
    const body = await req.json()
    const validatedData = studentSchema.parse(body)

    const student = await db.student.create({
      data: { ...validatedData, user_id: user.id },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError)
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    return NextResponse.json({ error: "Error in server" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Signup and login first to register" },
        { status: 403 }
      )
    }
    const body = await req.json()
    const validatedData = studentSchema.parse(body)

    const student = await db.student.update({
      where: { user_id: user.id },
      data: validatedData,
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student, { status: 202 })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Signup and login first to register" },
        { status: 403 }
      )
    }
    const body = await req.json()
    const validatedData = socialsSchema.parse(body)

    const updatedSocials = await db.socials.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...validatedData,
      },
      update: validatedData,
    })

    return NextResponse.json(updatedSocials, { status: 202 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Socials not found" },
          { status: 404 }
        )
      }
    }
    console.error("Error updating socials:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
