"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScheduleCard } from "@/components/dashboard/schedule-card"
import { ScheduleFilters } from "@/components/dashboard/schedule-filters"
import { ScheduleModal } from "@/components/dashboard/schedule-modal"
import { ThemeProvider } from "next-themes"
import { Toaster, toast } from "sonner"
import { Loader } from "lucide-react"
import { Schedule } from "@prisma/client"
import axios from "axios"

export function ScheduleSection() {
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
        null
    )
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        day: "",
        branch: "",
        group: "",
        semester: "",
    })

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true)
                const res = await axios.get("/api/schedule", {
                    params: filters,
                })
                console.log(res)
                setSchedules(res.data)
            } catch (error) {
                console.error("Failed to fetch schedules:", error)
                toast.error(
                    "Failed to fetch schedules. Please try again later."
                )
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
            <Toaster position="top-center" />
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto"
                >
                    <ScheduleFilters onFilterChange={setFilters} />

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
                                        onClick={() =>
                                            setSelectedSchedule(schedule)
                                        }
                                    />
                                ))}

                                {schedules.length === 0 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-muted-foreground"
                                    >
                                        No schedules found with the selected
                                        filters.
                                    </motion.p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <ScheduleModal
                schedule={selectedSchedule}
                isOpen={!!selectedSchedule}
                onClose={() => setSelectedSchedule(null)}
            />
        </>
    )
}
