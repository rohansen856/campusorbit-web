import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    course_code: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const user = await currentUser()
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      })
    }

    const { params } = routeContextSchema.parse(context)

    if (!params.course_code) {
      return new Response(JSON.stringify({ error: "Invalid course code" }), {
        status: 400,
      })
    }

    const attendance = await db.attendance.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        studentId: user.id,
        schedule: {
          course_code: params.course_code,
        },
      },
    })

    return new Response(JSON.stringify(attendance), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
