import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

const AttendanceSchema = z.object({
  studentId: z.string().min(5),
  scheduleId: z.string().min(5),
  status: z.enum(["PRESENT", "ABSENT", "EXCUSED"]),
  date: z.string(),
})

export async function POST(req: Request) {
  try {
    const user = currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    const body = await req.json()
    const { studentId, scheduleId, status, date } = AttendanceSchema.parse(body)
    const attendanceDate = new Date(date)
    attendanceDate.setHours(18, 0, 0, 0)

    const attendance = await db.attendance.upsert({
      where: {
        studentId_scheduleId_attendanceDate: {
          studentId,
          scheduleId,
          attendanceDate,
        },
      },
      create: {
        studentId,
        scheduleId,
        status,
        attendanceDate,
      },
      update: {
        status,
      },
    })
    return new Response(JSON.stringify(attendance), { status: 201 })
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          details: error.errors,
        }),
        { status: 400 }
      )
    }
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new Response(
        JSON.stringify({ error: "Attendance already marked!" }),
        { status: 409 }
      )
    }
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    const attendance = await db.attendance.findMany({
      where: {
        studentId: user.id,
      },

      orderBy: {
        attendanceDate: "asc",
      },
    })

    return new Response(JSON.stringify(attendance), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
      })
    }
    const attendance = await db.attendance.delete({
      where: {
        id,
      },
    })

    return new Response(JSON.stringify(attendance), { status: 200 })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return new Response(
        JSON.stringify({
          error: "Attendance data not found or already deleted",
        }),
        {
          status: 404,
        }
      )
    }
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
