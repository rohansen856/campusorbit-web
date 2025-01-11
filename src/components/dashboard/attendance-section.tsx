import Link from "next/link"
import { AttendanceRecord } from "@/types"
import { Student } from "@prisma/client"
import { ArrowRight, Calendar, Trash } from "lucide-react"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { getGroupedAttendance } from "@/lib/group-attendace"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ScrollArea } from "../ui/scroll-area"
import { AddAttendanceDialog } from "./add-attendance"
import { AttendanceGraph } from "./attendance-graph"
import { AttendanceCard } from "./attendance-history-card"
import { TotalAttendance } from "./total-attendance"

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

  const schedules = await db.schedule.findMany({
    where: {
      institute_id: student.institute_id,
      branch: student.branch,
      semester: student.semester,
      group: student.group,
      NOT: {
        type: "lab",
      },
    },
    distinct: ["course_code"],
  })

  const attendanceHistory: AttendanceRecord[] = await db.attendance.findMany({
    where: {
      studentId: user.id,
    },
    select: {
      id: true,
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
    <Card className="h-[80vh] w-full border-none p-0">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 h-full">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href={"/schedule"}
              className="bg-secondary group mb-2 flex w-full items-center justify-center rounded-xl py-8 text-xl"
            >
              View Full Schedule{" "}
              <ArrowRight className="ml-2 size-6 duration-300 group-hover:translate-x-2" />
            </Link>
            <AddAttendanceDialog schedules={schedules} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <AttendanceGraph
              subjects={allSubjects}
              attendanceData={groupedAttendance}
            />
            <TotalAttendance
              subjects={allSubjects}
              attendanceData={groupedAttendance}
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          {groupedAttendance.length === 0 && (
            <div className="flex h-[50vh] w-full items-center justify-center text-yellow-500">
              No record found
            </div>
          )}
          <ScrollArea className="h-[75vh]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupedAttendance.map((attendance) => (
                <AttendanceCard key={attendance.date} attendance={attendance} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
