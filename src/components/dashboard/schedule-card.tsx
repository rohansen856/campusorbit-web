"use client"

import { useState } from "react"
import { Schedule, Student } from "@prisma/client"
import axios, { AxiosError } from "axios"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarDays, Check, Clock, MapPin, User, X } from "lucide-react"
import { toast } from "sonner"

import { courseTypeColors } from "@/lib/theme-utils"
import { Badge } from "@/components/ui/badge"

import { Button } from "../ui/button"

interface ScheduleCardProps {
  schedule: Schedule & { Attendance: { status: string }[] }
  student: Student
  onClick: () => void
}

export function ScheduleCard({
  schedule,
  student,
  onClick,
}: ScheduleCardProps) {
  const typeColors =
    courseTypeColors[schedule.type as keyof typeof courseTypeColors]
  const scheduleDate = new Date()
  scheduleDate.setDate(
    scheduleDate.getDate() + (schedule.day - new Date().getDay())
  )

  async function markAttendance(status: "PRESENT" | "ABSENT" | "EXCUSED") {
    try {
      const res = await axios.post("/api/attendance", {
        studentId: student.user_id,
        scheduleId: schedule.id,
        status,
        date: scheduleDate,
      })
      console.log({
        studentId: student.user_id,
        scheduleId: schedule.id,
        status,
      })

      if (res.status === 201)
        toast.success(`You have been marked as ${status.toLowerCase()}`)
    } catch (error) {
      if ((error as AxiosError).status === 409) {
        toast.warning("You have already been marked for this schedule.")
      } else toast.error("Failed to mark attendance! Please try again later.")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`flex flex-col md:flex-row gap-4 items-center
        relative p-4 rounded-lg cursor-pointer
        ${typeColors?.bg || ""} ${typeColors?.border || ""}
        border backdrop-blur-md shadow-lg
        transition-all duration-300
      `}
    >
      <div className="w-full" onClick={onClick}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-base leading-tight">
              {schedule.course_title}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className={typeColors?.text}>
                {schedule.course_code}
              </Badge>
              <Badge variant="outline" className={typeColors?.text}>
                {schedule.type}
              </Badge>
              {schedule.Attendance.length > 0 && (
                <Badge variant="default">{schedule.Attendance[0].status}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <User className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
            <span className="truncate">{schedule.prof}</span>
          </div>

          {schedule.room && schedule.room.length > 0 && (
            <div className="flex items-center gap-1.5">
              <MapPin className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
              <span>{schedule.room}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 col-span-2">
            <Clock className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
            <span>
              {format(new Date(schedule.from), "hh:mm a")} -{" "}
              {format(new Date(schedule.to), "hh:mm a")}
            </span>
          </div>

          {scheduleDate.getDay() !== new Date().getDay() && (
            <div className="flex items-center gap-1.5 col-span-2">
              <CalendarDays className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
              <span>
                {scheduleDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
      {student.institute_id === schedule.institute_id &&
        student.branch === schedule.branch &&
        student.semester === schedule.semester &&
        student.group === schedule.group &&
        schedule.type.toLowerCase() !== "lab" && (
          <div className="w-full md:w-40 md:h-full grid grid-cols-3 gap-1">
            <Button
              variant={"secondary"}
              className="w-full col-span-1 md:col-span-3 text-green-600"
              onClick={(e) => markAttendance("PRESENT")}
            >
              <Check />
              Present
            </Button>
            <Button
              variant={"secondary"}
              className="w-full col-span-1 md:col-span-3 text-rose-600"
              onClick={(e) => markAttendance("ABSENT")}
            >
              <X />
              Absent
            </Button>
            <Button
              variant={"secondary"}
              className="w-full col-span-1 md:col-span-3 text-yellow-600"
              onClick={(e) => markAttendance("EXCUSED")}
            >
              Cancelled
            </Button>
          </div>
        )}
    </motion.div>
  )
}
