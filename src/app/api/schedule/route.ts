import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const user = await currentUser()
    if (!user)
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 403,
      })
    const { searchParams } = new URL(request.url)
    const day = searchParams.get("day")
    const branch = searchParams.get("branch")
    const group = searchParams.get("group")
    const semester = searchParams.get("semester")

    const student = await db.student.findUnique({
      where: {
        user_id: user.id,
      },
      select: {
        branch: true,
        group: true,
        semester: true,
        institute: {
          select: {
            id: true,
          },
        },
      },
    })
    if (!student)
      return new Response(JSON.stringify({ error: "Unauthorized access" }), {
        status: 403,
      })

    const where = {
      ...(day && day.length > 0
        ? { day: parseInt(day) }
        : { day: new Date().getDay() }),
      ...(branch && branch.length > 0
        ? { branch }
        : { branch: student?.branch }),
      ...(group && group.length > 0 ? { group } : { group: student?.group }),
      ...(semester && parseInt(semester) > 0
        ? { semester: parseInt(semester) }
        : { semester: student.semester }),
      institute_id: student.institute.id,
    }

    const schedules = await db.schedule.findMany({
      where,
      include: {
        Attendance: {
          where: {
            studentId: user.id,
            attendanceDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
              lt: new Date(new Date().setHours(24, 0, 0, 0)), // Start of tomorrow
            },
          },
          select: {
            status: true,
          },
        },
      },
      orderBy: [{ day: "asc" }, { from: "asc" }],
    })

    return new Response(JSON.stringify(schedules), { status: 200 })
  } catch (error) {
    console.error("Failed to fetch schedules:", error)
    return new Response(
      JSON.stringify({ error: "Failed to fetch schedules" }),
      { status: 500 }
    )
  }
}
