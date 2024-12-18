"use client"

import { motion } from "framer-motion"
import { Clock, MapPin, User } from "lucide-react"
import { format } from "date-fns"
import { courseTypeColors } from "@/lib/theme-utils"
import { Badge } from "@/components/ui/badge"

interface ScheduleCardProps {
    schedule: any
    onClick: () => void
}

export function ScheduleCard({ schedule, onClick }: ScheduleCardProps) {
    const typeColors =
        courseTypeColors[schedule.type as keyof typeof courseTypeColors]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={`
        relative p-4 rounded-lg cursor-pointer
        ${typeColors?.bg || ""} ${typeColors?.border || ""}
        border backdrop-blur-md shadow-lg
        transition-all duration-300
      `}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="font-semibold text-base leading-tight">
                        {schedule.course_title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className={typeColors?.text}>
                            {schedule.course_code}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                    <User className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
                    <span className="truncate">{schedule.prof}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
                    <span>Room {schedule.room}</span>
                </div>

                <div className="flex items-center gap-1.5 col-span-2">
                    <Clock className={`w-3.5 h-3.5 ${typeColors?.icon}`} />
                    <span>
                        {format(new Date(schedule.from), "hh:mm a")} -{" "}
                        {format(new Date(schedule.to), "hh:mm a")}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}
