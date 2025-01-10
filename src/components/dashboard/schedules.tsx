"use client"

import React, { useEffect, useState } from "react"
import { Student, type Schedule } from "@prisma/client"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, Calendar, Loader } from "lucide-react"
import { toast } from "sonner"

import { days } from "@/lib/data"
import { ScheduleCard } from "@/components/dashboard/schedule-card"
import { ScheduleFilters } from "@/components/dashboard/schedule-filters"
import { ScheduleModal } from "@/components/dashboard/schedule-modal"

import { Card, CardHeader } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"

interface ScheduleSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student
}

export function ScheduleSection({ student, ...props }: ScheduleSectionProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  )
  const [schedules, setSchedules] = useState<
    (Schedule & { Attendance: { status: string }[] })[]
  >([])
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
        const res = await axios.get<
          (Schedule & { Attendance: { status: string }[] })[]
        >("/api/schedule", {
          params: filters,
        })
        setSchedules(res.data)
      } catch (error) {
        toast.error("Failed to fetch schedules. Please try again later.", {
          description: "Check your connection and try again",
        })
      } finally {
        // Reduced timeout for better UX
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }

    fetchSchedules()
  }, [filters])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Card className="from-background to-muted/20 bg-gradient-to-b md:h-[80vh]">
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl"
        >
          <div className="bg-card mb-6 border-b shadow-sm">
            <ScheduleFilters student={student} onFilterChange={setFilters} />
          </div>

          <AnimatePresence mode="wait">
            <ScrollArea className="md:h-[60vh]">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center space-y-4 py-12"
                >
                  <Loader className="text-primary size-8 animate-spin" />
                  <p className="text-muted-foreground animate-pulse">
                    Loading your schedule...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {schedules.length > 0 ? (
                    <div className="space-y-4">
                      {schedules.map((schedule) => (
                        <motion.div key={schedule.id} variants={itemVariants}>
                          <ScheduleCard
                            schedule={schedule}
                            student={student}
                            onClick={() => setSelectedSchedule(schedule)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center space-y-4 py-12"
                    >
                      <div className="bg-muted rounded-full p-4">
                        <Calendar className="text-muted-foreground size-8" />
                      </div>
                      <div className="text-center">
                        <h3 className="mb-1 font-semibold">No Classes Found</h3>
                        <p className="text-muted-foreground max-w-sm text-sm">
                          No classes scheduled for{" "}
                          {days[Number(filters.day)]?.label}{" "}
                          {filters.semester && "Semester " + filters.semester}{" "}
                          {filters.branch} {filters.group}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </ScrollArea>
          </AnimatePresence>
        </motion.div>
      </section>

      <ScheduleModal
        schedule={selectedSchedule}
        isOpen={!!selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
      />
    </Card>
  )
}
