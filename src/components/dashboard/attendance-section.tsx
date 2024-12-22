import { Student } from "@prisma/client"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"

import { ScrollArea } from "../ui/scroll-area"
import { AttendanceGraph } from "./attendance-graph"
import { TotalAttendance } from "./total-attendance"

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

  return Object.entries(groupedByDate)
    .map(([date, details]) => ({
      date,
      details,
    }))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
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
    <section className="w-full flex flex-col-reverse md:flex-row pr-0">
      <div className="w-full md:w-[400px] h-full md:pr-4 md:border-r md:mr-4">
        <AttendanceGraph subjects={allSubjects} />
        <TotalAttendance
          subjects={allSubjects}
          attendanceData={groupedAttendance}
        />
      </div>
      <ScrollArea className="max-h-[70vh] w-full pr-2">
        <div className="grid gap-2 grid-cols-3 md:grid-cols-2 xl:grid-cols-6 w-full">
          {groupedAttendance.map((attendance) => (
            <div className="h-64 p-2 col-span-1" key={attendance.date}>
              <p className="text-sm text-muted-foreground text-center mb-4 pb-px border-b-2">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "short",
                }).format(new Date(attendance.date))}
              </p>
              {attendance.details.map((detail) => (
                <p
                  key={detail.course_code}
                  className={cn(
                    "min-w-24 w-full rounded text-center border mb-2",
                    detail.status === "PRESENT" &&
                      "bg-green-500/30 border-green-500",
                    detail.status === "ABSENT" &&
                      "bg-red-500/30 border-red-500",
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
      </ScrollArea>
    </section>
  )
}
