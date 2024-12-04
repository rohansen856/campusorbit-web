"use client"

import { Schedule } from "@prisma/client"
import { format } from "date-fns"
import {
  BookOpen,
  Building,
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
} from "lucide-react"

import { courseTypeColors } from "@/lib/theme-utils"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ScheduleModalProps {
  schedule: Schedule | null
  isOpen: boolean
  onClose: () => void
}

export function ScheduleModal({
  schedule,
  isOpen,
  onClose,
}: ScheduleModalProps) {
  if (!schedule) return null

  const typeColors =
    courseTypeColors[schedule.type as keyof typeof courseTypeColors]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`
        sm:max-w-[500px] backdrop-blur-xl
        ${typeColors.bg} border ${typeColors.border}
        shadow-xl
      `}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {schedule.course_title}
          </DialogTitle>
          <Badge variant="secondary" className={`${typeColors.text} mt-2`}>
            {schedule.course_code}
          </Badge>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className={`w-4 h-4 ${typeColors.icon}`} />
                <span className="text-sm font-medium">Professor</span>
              </div>
              <p className="text-sm ml-6">{schedule.prof}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${typeColors.icon}`} />
                <span className="text-sm font-medium">Time</span>
              </div>
              <p className="text-sm ml-6">
                {format(new Date(schedule.from), "hh:mm a")} -{" "}
                {format(new Date(schedule.to), "hh:mm a")}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${typeColors.icon}`} />
                <span className="text-sm font-medium">Room</span>
              </div>
              <p className="text-sm ml-6">{schedule.room}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building className={`w-4 h-4 ${typeColors.icon}`} />
                <span className="text-sm font-medium">Branch</span>
              </div>
              <p className="text-sm ml-6">{schedule.branch}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${typeColors.icon}`} />
                <span className="text-sm font-medium">Group</span>
              </div>
              <p className="text-sm ml-6">{schedule.group}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${typeColors.icon}`} />
                <span className="text-sm font-medium">Semester</span>
              </div>
              <p className="text-sm ml-6">{schedule.semester}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
