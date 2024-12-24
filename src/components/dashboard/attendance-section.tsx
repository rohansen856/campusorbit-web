import React, { useState } from "react"
import { Student } from "@prisma/client"
import { Calendar } from "lucide-react"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    const date = new Date(attendanceDate).toISOString()

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

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PRESENT: {
      bg: "bg-green-500/30",
      border: "border-green-500",
      text: "Present",
    },
    ABSENT: { bg: "bg-red-500/30", border: "border-red-500", text: "Absent" },
    EXCUSED: {
      bg: "bg-gray-500/30",
      border: "border-gray-500",
      text: "Excused",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <span
      className={cn("text-xs px-2 py-1 rounded-full", config.bg, config.border)}
    >
      {config.text}
    </span>
  )
}

const AttendanceCard = ({ attendance }: { attendance: TransformedRecord }) => {
  return (
    <Card className="h-full">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(attendance.date))}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          {attendance.details.map((detail) => (
            <div
              key={detail.course_code}
              className="flex items-center justify-between p-2 rounded bg-muted/50"
            >
              <span className="text-sm font-medium">{detail.course_code}</span>
              <StatusBadge status={detail.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
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
    <Card className="w-full p-0 h-[80vh] border-none">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 h-full">
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
          <ScrollArea className="h-[75vh]">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
