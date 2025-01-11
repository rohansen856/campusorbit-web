import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { attendanceFormSchema } from "@/lib/validation"

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }
    const json = await req.json()
    const body = attendanceFormSchema.parse({
      ...json,
      date: new Date(new Date(json.date).setHours(0, 0, 0, 0)),
    })

    await db.attendance.createMany({
      data: body.entries.map((entry) => ({
        studentId: user.id,
        scheduleId: entry.scheduleId,
        status: entry.status,
        attendanceDate: body.date,
      })),
    })

    return new Response("Attendance records created", { status: 201 })
  } catch (error) {
    console.log(error)
    return new Response("Invalid request data", { status: 422 })
  }
}
