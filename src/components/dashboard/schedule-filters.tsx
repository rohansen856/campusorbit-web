"use client"

import { useState } from "react"
import { Student } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { branches, days, groups, semesters } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ScheduleFiltersProps {
  student: Student
  onFilterChange: (filters: any) => void
}

export function ScheduleFilters({
  student,
  onFilterChange,
}: ScheduleFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState({
    day: new Date().getDay().toString(),
    branch: student.branch,
    group: student.group,
    semester: student.semester.toString(),
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
        <span>Apply Filters</span>
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
            className="grid grid-cols-4 gap-2 p-4"
          >
            <Select
              value={filters.day}
              onValueChange={(value) => handleFilterChange("day", value)}
            >
              <SelectTrigger className="bg-secondary col-span-1">
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.branch}
              onValueChange={(value) => handleFilterChange("branch", value)}
            >
              <SelectTrigger className="bg-secondary col-span-1">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.key} value={branch.key}>
                    {branch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.group}
              onValueChange={(value) => handleFilterChange("group", value)}
            >
              <SelectTrigger className="bg-secondary col-span-1">
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
              onValueChange={(value) => handleFilterChange("semester", value)}
            >
              <SelectTrigger className="bg-secondary col-span-1">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((semester) => (
                  <SelectItem key={semester} value={semester.toString()}>
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
