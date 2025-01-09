import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { AcademicSchedule } from "@/components/schedule/schedule-view"

export default async function Page() {
  const user = await currentUser()
  if (!user) return null
  const student = await db.student.findUnique({
    where: {
      user_id: user.id,
    },
    include: {
      institute: {
        select: {
          id: true,
          name: true,
          short_name: true,
          logo_url: true,
          website_url: true,
        },
      },
    },
  })
  if (!student) return null

  const schedule = await db.schedule.findMany({
    where: {
      institute_id: student.institute_id,
      branch: student.branch,
      semester: student.semester,
      group: "A",
    },
  })
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AcademicSchedule classes={schedule} />
    </div>
  )
}
