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
    <div className="w-full">
      {/* Filter Summary Bar */}
      <div className="flex items-center justify-between gap-4 mb-2">
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
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </Button>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {days.find((d) => d.value.toString() === filters.day)?.label}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          {branches.find((b) => b.key === filters.branch)?.label}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          Group {filters.group}
        </Badge>
        <Badge variant="outline" className="flex items-center gap-1">
          <GraduationCap className="w-3 h-3" />
          Semester {filters.semester}
        </Badge>
      </div>

      {/* Filter Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
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
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Branch
                </label>
                <Select
                  value={filters.branch}
                  onValueChange={(value) => handleFilterChange("branch", value)}
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
                <label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Group
                </label>
                <Select
                  value={filters.group}
                  onValueChange={(value) => handleFilterChange("group", value)}
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
                <label className="text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
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

            <div className="flex justify-end my-2 gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
