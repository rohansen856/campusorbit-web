"use client"

import React, { useState } from "react"
import { Student } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  GraduationCap,
  Users,
} from "lucide-react"

import { branches, days, groups, semesters } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
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

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.day !== new Date().getDay().toString()) count++
    if (filters.branch !== student.branch) count++
    if (filters.group !== student.group) count++
    if (filters.semester !== student.semester.toString()) count++
    return count
  }

  return (
    <div className="relative">
      {/* Fixed Content - Always Visible */}
      <div className="p-4">
        {/* Filter Summary Bar */}
        <div className="mb-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Filters</h3>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="mr-2">{isExpanded ? "Hide" : "Show"} filters</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="size-4" />
            </motion.div>
          </Button>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="size-3" />
            {days.find((d) => d.value.toString() === filters.day)?.label}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {branches.find((b) => b.key === filters.branch)?.label}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="size-3" />
            Group {filters.group}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <GraduationCap className="size-3" />
            Semester {filters.semester}
          </Badge>
        </div>
      </div>

      {/* Expandable Content - Absolute Positioned */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-background absolute inset-x-0 top-[130px] z-10 border-t"
          >
            <div className="p-4">
              <div className="bg-muted/50 grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="size-4" />
                    Day
                  </label>
                  <Select
                    value={filters.day}
                    onValueChange={(value) => handleFilterChange("day", value)}
                  >
                    <SelectTrigger className="w-full">
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
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="size-4" />
                    Branch
                  </label>
                  <Select
                    value={filters.branch}
                    onValueChange={(value) =>
                      handleFilterChange("branch", value)
                    }
                  >
                    <SelectTrigger className="w-full">
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
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Users className="size-4" />
                    Group
                  </label>
                  <Select
                    value={filters.group}
                    onValueChange={(value) =>
                      handleFilterChange("group", value)
                    }
                  >
                    <SelectTrigger className="w-full">
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
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="size-4" />
                    Semester
                  </label>
                  <Select
                    value={filters.semester}
                    onValueChange={(value) =>
                      handleFilterChange("semester", value)
                    }
                  >
                    <SelectTrigger className="w-full">
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
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const defaultFilters = {
                      day: new Date().getDay().toString(),
                      branch: student.branch,
                      group: student.group,
                      semester: student.semester.toString(),
                    }
                    setFilters(defaultFilters)
                    onFilterChange(defaultFilters)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
