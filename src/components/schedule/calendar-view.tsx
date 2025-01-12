"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { TransformedAttendanceRecord } from "@/types"
import { Schedule } from "@prisma/client"
import axios, { AxiosError } from "axios"
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
import { ChevronLeft, ChevronRight, Loader, Trash } from "lucide-react"
import { toast } from "sonner"

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

import { AddAttendanceDialog } from "../dashboard/add-attendance"

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
  schedules: Schedule[]
  attendanceRecords: TransformedAttendanceRecord[]
}

export function CalendarView({
  schedules,
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

    const summary: { [key in "PRESENT" | "ABSENT" | "EXCUSED"]: number } = {
      PRESENT: 0,
      ABSENT: 0,
      EXCUSED: 0,
    }

    record.details.forEach((detail) => {
      summary[detail.status as "PRESENT" | "ABSENT" | "EXCUSED"]++
    })

    return summary
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsDialogOpen(true)
  }

  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  async function deleteAttendance(id: string) {
    setIsDeleting(true)
    setDeletingId(id)
    try {
      await axios.delete(`/api/attendance`, { data: { id } })
      toast.success("Attendance deleted successfully")
      router.refresh()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        toast.error("Attendance not found or already deleted")
      }
      toast.error("Failed to delete attendance")
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-4" id="calendar-view">
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
                "relative flex aspect-square flex-col items-center overflow-hidden rounded-lg border p-2 transition-colors",
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
                    <>
                      <Badge
                        variant={"outline"}
                        className="hidden text-green-600 md:block dark:text-green-400"
                      >
                        {attendanceSummary.PRESENT}P
                      </Badge>
                      <div className="mr-1 flex gap-0.5 md:hidden">
                        {[...Array(attendanceSummary.PRESENT)].map(
                          (_, index) => (
                            <div
                              key={`present-${index}`}
                              className="size-1.5 rounded-full bg-green-600 dark:bg-green-400"
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                  {attendanceSummary.ABSENT > 0 && (
                    <>
                      <Badge
                        variant={"outline"}
                        className="hidden text-red-600 md:block dark:text-red-400"
                      >
                        {attendanceSummary.ABSENT}A
                      </Badge>
                      <div className="mr-1 flex gap-0.5 md:hidden">
                        {[...Array(attendanceSummary.ABSENT)].map(
                          (_, index) => (
                            <div
                              key={`absent-${index}`}
                              className="size-1.5 rounded-full bg-red-600 dark:bg-red-400"
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                  {attendanceSummary.EXCUSED > 0 && (
                    <>
                      <Badge
                        variant={"outline"}
                        className="hidden text-yellow-600 md:block dark:text-yellow-400"
                      >
                        {attendanceSummary.EXCUSED}C
                      </Badge>
                      <div className="flex gap-0.5 md:hidden">
                        {[...Array(attendanceSummary.EXCUSED)].map(
                          (_, index) => (
                            <div
                              key={`excused-${index}`}
                              className="size-1.5 rounded-full bg-yellow-600 dark:bg-yellow-400"
                            />
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              {attendanceSummary && (
                <div className="absolute inset-x-1 bottom-1 flex justify-center gap-1"></div>
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
                          className="flex items-center justify-between gap-2 rounded border p-2"
                        >
                          <span className="font-medium">
                            {detail.course_code}
                          </span>
                          <StatusBadge status={detail.status} />
                          <Button
                            variant={"destructive"}
                            className="ml-auto size-6 rounded-full"
                            onClick={() => deleteAttendance(detail.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting && deletingId === detail.id ? (
                              <Loader className="animate-spin" />
                            ) : (
                              <Trash />
                            )}
                          </Button>
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
              <AddAttendanceDialog
                schedules={schedules}
                date={selectedDate}
                className="w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
