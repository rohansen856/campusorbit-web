import { AttendanceRecord } from "@/types"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { getGroupedAttendance } from "@/lib/group-attendace"
import { Separator } from "@/components/ui/separator"
import { CalendarView } from "@/components/schedule/calendar-view"
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

  const attendanceHistory: AttendanceRecord[] = await db.attendance.findMany({
    where: {
      studentId: user.id,
    },
    select: {
      attendanceDate: true,
      status: true,
      schedule: {
        select: {
          course_code: true,
        },
      },
    },
  })

  const groupedAttendance = getGroupedAttendance(attendanceHistory)
  console.log(groupedAttendance)
  return (
    <div className="min-h-screen space-y-6">
      <AcademicSchedule classes={schedule} student={student} />
      <Separator className="w-full" />
      <CalendarView attendanceRecords={groupedAttendance} />
    </div>
  )
}
