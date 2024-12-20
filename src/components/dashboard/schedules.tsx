"use client"

import { useEffect, useState } from "react"
import { Student, type Schedule } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import { toast } from "sonner"

import { ScheduleCard } from "@/components/dashboard/schedule-card"
import { ScheduleFilters } from "@/components/dashboard/schedule-filters"
import { ScheduleModal } from "@/components/dashboard/schedule-modal"

import { ScrollArea } from "../ui/scroll-area"

interface ScheduleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student
}

export function ScheduleSection({ student, ...props }: ScheduleSectionProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  )
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    day: new Date().getDay().toString(),
    branch: student.branch,
    group: student.group,
    semester: student.semester,
  })

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const res = await axios.get<Schedule[]>("/api/schedule", {
          params: filters,
        })
        setSchedules(res.data)
      } catch (error) {
        toast.error("Failed to fetch schedules. Please try again later.")
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 5000)
      }
    }

    fetchSchedules()
  }, [filters])

  return (
    <>
      <ScrollArea className="md:h-[70vh]">
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto"
          >
            <ScheduleFilters student={student} onFilterChange={setFilters} />

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex"
                >
                  <Loader className="size-6 animate-spin mx-auto" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {schedules.map((schedule) => (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      student={student}
                      onClick={() => setSelectedSchedule(schedule)}
                    />
                  ))}

                  {schedules.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground"
                    >
                      No schedules found with the selected filters.
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </ScrollArea>

      <ScheduleModal
        schedule={selectedSchedule}
        isOpen={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      />
    </>
  )
}
