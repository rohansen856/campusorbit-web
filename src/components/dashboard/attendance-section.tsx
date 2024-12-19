import { Student } from "@prisma/client"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"

import { AttendanceGraph } from "./attendance-graph"

type AttendanceRecord = {
  attendanceDate: Date
  status: string
  schedule: { course_code: string }
}

type TransformedRecord = {
  date: string
  details: { course_code: string; status: string }[]
}

function getGroupedAttendance(
  records: AttendanceRecord[]
): TransformedRecord[] {
  const groupedByDate: Record<
    string,
    { course_code: string; status: string }[]
  > = {}

  records.forEach((record) => {
    const { attendanceDate, status, schedule } = record
    const date = new Date(attendanceDate).toISOString() // Standardize date format

    if (!groupedByDate[date]) {
      groupedByDate[date] = []
    }

    groupedByDate[date].push({
      course_code: schedule.course_code,
      status: status,
    })
  })

  return Object.entries(groupedByDate).map(([date, details]) => ({
    date,
    details,
  }))
}

interface AttendanceSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student
}

export async function AttendanceSection({
  student,
  ...props
}: AttendanceSectionProps) {
  const user = await currentUser()
  if (!user) return null

  const allSubjects = await db.schedule.findMany({
    where: {
      institute_id: student.institute_id,
      branch: student.branch,
      semester: student.semester,
      group: student.group,
      NOT: {
        type: "LAB",
      },
    },
    select: {
      course_code: true,
      course_title: true,
    },
    distinct: ["course_code"],
    orderBy: [{ day: "asc" }, { from: "asc" }],
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

  return (
    <section className="w-full bg-secondary/30 border rounded-xl p-4 flex flex-col md:flex-row">
      <div className="w-full min-w-64 max-w-64 h-64 md:pr-4 md:border-r border-primary/30 md:mr-4">
        <AttendanceGraph subjects={allSubjects} />
      </div>
      <div className="flex gap-2 max-w-full overflow-x-auto border-t-2 md:border-t-0 py-4 md:py-0">
        {groupedAttendance.map((attendance) => (
          <div className="h-full">
            <p className="text-sm text-muted-foreground text-center mb-4 pb-px border-b-2">
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
              }).format(new Date(attendance.date))}
            </p>
            {attendance.details.map((detail) => (
              <p
                className={cn(
                  "min-w-24 w-full rounded-lg text-center border mb-2",
                  detail.status === "PRESENT" &&
                    "bg-green-500/30 border-green-500",
                  detail.status === "ABSENT" && "bg-red-500/30 border-red-500",
                  detail.status === "EXCUSED" &&
                    "bg-gray-500/30 border-gray-500"
                )}
              >
                {detail.course_code}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
