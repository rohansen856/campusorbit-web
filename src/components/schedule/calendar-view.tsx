"use client"

import React, { useState } from "react"
import {
  AttendanceRecord,
  SpecialDate,
  TransformedAttendanceRecord,
} from "@/types"
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isWeekend,
  parseISO,
  startOfMonth,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { specialDates } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PRESENT: {
      bg: "bg-green-500/30",
      border: "border-green-500",
      text: "Present",
    },
    ABSENT: {
      bg: "bg-red-500/30",
      border: "border-red-500",
      text: "Absent",
    },
    EXCUSED: {
      bg: "bg-gray-500/30",
      border: "border-gray-500",
      text: "Excused",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <span
      className={cn("rounded-full px-2 py-1 text-xs", config.bg, config.border)}
    >
      {config.text}
    </span>
  )
}

interface CalendarViewProps {
  attendanceRecords: TransformedAttendanceRecord[]
}

export function CalendarView({
  attendanceRecords,
  ...props
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const firstDayOfMonth = startOfMonth(currentDate)
  const lastDayOfMonth = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  const previousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  const getSpecialDate = (date: Date) => {
    return specialDates.find((special) => isSameDay(special.date, date))
  }

  const getAttendanceForDate = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    return attendanceRecords.find(
      (record) => record.date.split("T")[0] === formattedDate
    )
  }

  const getAttendanceSummary = (date: Date) => {
    const record = getAttendanceForDate(date)
    if (!record) return null

    const summary: { [key in "PRESENT" | "ABSENT" | "CANCELLED"]: number } = {
      PRESENT: 0,
      ABSENT: 0,
      CANCELLED: 0,
    }

    record.details.forEach((detail) => {
      summary[detail.status as "PRESENT" | "ABSENT" | "CANCELLED"]++
    })

    return summary
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            disabled={currentDate.getMonth() === 0}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            disabled={currentDate.getMonth() === 11}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {daysInMonth.map((date) => {
          const specialDate = getSpecialDate(date)
          const attendanceSummary = getAttendanceSummary(date)
          const isWeekendDay = isWeekend(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={cn(
                "relative flex aspect-square flex-col items-center rounded-lg border p-2 transition-colors",
                "hover:bg-accent",
                {
                  "bg-red-100 dark:bg-red-900/30":
                    specialDate?.type === "holiday",
                  "bg-yellow-100 dark:bg-yellow-900/30":
                    specialDate?.type === "half day",
                  "bg-muted": isWeekendDay && !specialDate,
                  "opacity-50": !isSameMonth(date, currentDate),
                }
              )}
            >
              <span className="text-sm font-medium">{format(date, "d")}</span>
              {specialDate && (
                <span className="mt-1 line-clamp-2 text-center text-[10px]">
                  {specialDate.event}
                </span>
              )}
              {attendanceSummary && (
                <div className="absolute inset-x-1 bottom-1 flex justify-center gap-1 text-[8px]">
                  {attendanceSummary.PRESENT > 0 && (
                    <Badge
                      variant={"outline"}
                      className="text-green-600 dark:text-green-400"
                    >
                      {attendanceSummary.PRESENT}P
                    </Badge>
                  )}
                  {attendanceSummary.ABSENT > 0 && (
                    <Badge
                      variant={"outline"}
                      className="text-red-600 dark:text-red-400"
                    >
                      {attendanceSummary.ABSENT}A
                    </Badge>
                  )}
                  {attendanceSummary.CANCELLED > 0 && (
                    <Badge
                      variant={"outline"}
                      className="text-yellow-600 dark:text-yellow-400"
                    >
                      {attendanceSummary.CANCELLED}C
                    </Badge>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          {selectedDate && (
            <div className="space-y-4">
              {getSpecialDate(selectedDate) && (
                <div>
                  <h3 className="mb-2 font-semibold">Special Event</h3>
                  <Badge
                    variant={
                      getSpecialDate(selectedDate)?.type === "holiday"
                        ? "destructive"
                        : "default"
                    }
                  >
                    {getSpecialDate(selectedDate)?.event}
                    {" - "}
                    {getSpecialDate(selectedDate)?.type}
                  </Badge>
                </div>
              )}
              {getAttendanceForDate(selectedDate) && (
                <div>
                  <h3 className="mb-2 font-semibold">Attendance Records</h3>
                  <div className="space-y-2">
                    {getAttendanceForDate(selectedDate)?.details.map(
                      (detail, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded border p-2"
                        >
                          <span className="font-medium">
                            {detail.course_code}
                          </span>
                          <StatusBadge status={detail.status} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
              {!getSpecialDate(selectedDate) &&
                !getAttendanceForDate(selectedDate) && (
                  <p className="text-muted-foreground">
                    No events or attendance records for this date.
                  </p>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
