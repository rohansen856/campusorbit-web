import { NextResponse } from "next/server"
import { studentSchema } from "@/lib/validation"
import { db } from "@/lib/db"
import { currentUser } from "@/lib/authentication"
import { z } from "zod"

export async function POST(request: Request) {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json(
                { error: "Signup and login first to register" },
                { status: 403 }
            )
        }
        const body = await request.json()
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
