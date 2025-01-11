"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TransformedAttendanceRecord } from "@/types"
import axios, { AxiosError } from "axios"
import { Calendar, Loader, Trash } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "../ui/button"

export const AttendanceCard = ({
  attendance,
}: {
  attendance: TransformedAttendanceRecord
}) => {
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
    <Card className="h-full">
      <CardHeader className="p-3">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground size-4" />
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
              className="bg-muted/50 flex items-center justify-between rounded p-2"
            >
              <span className="text-sm font-medium">{detail.course_code}</span>
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

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
      className={cn(
        "mx-2 rounded-full px-2 py-1 text-xs",
        config.bg,
        config.border
      )}
    >
      {config.text}
    </span>
  )
}
