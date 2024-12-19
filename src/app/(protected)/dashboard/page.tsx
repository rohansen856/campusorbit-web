import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { AttendanceSection } from "@/components/dashboard/attendance-section"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { ScheduleSection } from "@/components/dashboard/schedules"

export default async function ProfilePage() {
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

  return (
    <div>
      <div className="w-full flex gap-8 flex-col md:flex-row mb-16">
        <ProfileSection user={{ name: user.name ?? "" }} student={student} />
        <div className="md:block w-full md:w-2/5 md:border-l border-t md:border-t-0 py-4 md:pt-0">
          <ScheduleSection student={student} />
        </div>
      </div>
      <div className="container">
        <AttendanceSection student={student} />
      </div>
    </div>
  )
}
