"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { branches, groups, semesters, days } from "@/lib/data"

interface ScheduleFiltersProps {
    onFilterChange: (filters: any) => void
}

export function ScheduleFilters({ onFilterChange }: ScheduleFiltersProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [filters, setFilters] = useState({
        day: "",
        branch: "",
        group: "",
        semester: "",
    })

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }

    return (
        <div className="w-full mb-6">
            <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-4 bg-secondary"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>Filters</span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </Button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4 p-4"
                    >
                        <Select
                            value={filters.day}
                            onValueChange={(value) =>
                                handleFilterChange("day", value)
                            }
                        >
                            <SelectTrigger className="bg-secondary">
                                <SelectValue placeholder="Select Day" />
                            </SelectTrigger>
                            <SelectContent>
                                {days.map((day) => (
                                    <SelectItem
                                        key={day.value}
                                        value={day.value.toString()}
                                    >
                                        {day.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.branch}
                            onValueChange={(value) =>
                                handleFilterChange("branch", value)
                            }
                        >
                            <SelectTrigger className="bg-secondary">
                                <SelectValue placeholder="Select Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((branch) => (
                                    <SelectItem
                                        key={branch.key}
                                        value={branch.key}
                                    >
                                        {branch.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.group}
                            onValueChange={(value) =>
                                handleFilterChange("group", value)
                            }
                        >
                            <SelectTrigger className="bg-secondary">
                                <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group} value={group}>
                                        Group {group}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.semester}
                            onValueChange={(value) =>
                                handleFilterChange("semester", value)
                            }
                        >
                            <SelectTrigger className="bg-secondary">
                                <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                {semesters.map((semester) => (
                                    <SelectItem
                                        key={semester}
                                        value={semester.toString()}
                                    >
                                        Semester {semester}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
