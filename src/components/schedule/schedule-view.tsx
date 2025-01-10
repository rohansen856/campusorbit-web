"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Schedule } from "@prisma/client"
import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Settings,
} from "lucide-react"

import { days } from "@/lib/data"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface TypeColors {
  [key: string]: string
  theory: string
  lab: string
  tutorial: string
  other: string
}

interface ClassBoxProps {
  classInfo: Schedule
  cellWidth: number
  onClick: (classInfo: Schedule) => void
  isActive: boolean
}

interface AcademicScheduleProps {
  classes: Schedule[]
}

const timeSlots: number[] = Array.from({ length: 24 }, (_, i) => (i + 8) % 24) // 0-23 hours

const typeColors: TypeColors = {
  theory: "bg-blue-600/30 border-blue-400 hover:bg-blue-800",
  lab: "bg-green-600/30 border-green-400 hover:bg-green-800",
  tutorial: "bg-yellow-600/30 border-yellow-400 hover:bg-yellow-800",
  other: "bg-purple-600/30 border-purple-400 hover:bg-purple-800",
}

const ClassBox: React.FC<ClassBoxProps> = ({
  classInfo,
  cellWidth,
  onClick,
  isActive,
}) => {
  const duration = getClassDuration(classInfo.from, classInfo.to)
  const width = cellWidth * duration

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "absolute left-0 top-0 h-20 cursor-pointer rounded-md border p-2 shadow-sm transition-all",
        typeColors[classInfo.type] || typeColors.other,
        isActive && "ring-2 ring-blue-500 ring-offset-2"
      )}
      style={{ width: `${width}px` }}
      onClick={() => onClick(classInfo)}
    >
      <div className="truncate text-xs font-semibold text-white">
        {classInfo.course_code}
      </div>
      <div className="truncate text-xs text-white/90">{classInfo.room}</div>
    </motion.div>
  )
}

const getClassDuration = (from: string | Date, to: string | Date): number => {
  const start = new Date(from)
  const end = new Date(to)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60))
}

const getClassPosition = (timeString: string | Date): number => {
  const hour = new Date(timeString).getHours()
  return timeSlots.indexOf(hour)
}

const formatTime = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

const getCurrentTimePosition = () => {
  const now = new Date()
  return now.getHours() + now.getMinutes() / 60
}

export const AcademicSchedule: React.FC<AcademicScheduleProps> = ({
  classes,
}) => {
  const [selectedClass, setSelectedClass] = useState<Schedule | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [isScrolling, setIsScrolling] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(
    getCurrentTimePosition()
  )
  const [cellWidth, setCellWidth] = useState(144)
  const [show24Hours, setShow24Hours] = useState(true)

  const timeHeaderRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const visibleTimeSlots = useMemo(
    () => (show24Hours ? timeSlots : timeSlots.slice(0, 12)), // 8 AM to 7 PM if not 24 hours
    [show24Hours]
  )

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimePosition())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = (direction: "left" | "right"): void => {
    if (contentRef.current) {
      const scrollAmount = direction === "left" ? -cellWidth * 2 : cellWidth * 2
      contentRef.current.scrollTo({
        left: contentRef.current.scrollLeft + scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Sync scroll between header and content
  useEffect(() => {
    const timeHeader = timeHeaderRef.current
    const content = contentRef.current

    if (!timeHeader || !content) return

    const handleContentScroll = (): void => {
      if (timeHeader) {
        timeHeader.scrollLeft = content.scrollLeft
      }
      setIsScrolling(true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150)
    }

    content.addEventListener("scroll", handleContentScroll)
    return () => content.removeEventListener("scroll", handleContentScroll)
  }, [])

  // Update container width on resize
  useEffect(() => {
    const updateWidth = (): void => {
      if (contentRef.current) {
        setContainerWidth(contentRef.current.offsetWidth)
      }
    }

    updateWidth()
    const resizeObserver = new ResizeObserver(updateWidth)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div className="relative rounded-lg border bg-slate-100 shadow-lg dark:bg-gray-950">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Class Schedule</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScroll("left")}
              className="hover:bg-secondary rounded-full p-2 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScroll("right")}
              className="hover:bg-secondary rounded-full p-2 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </motion.button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hover:bg-secondary rounded-full p-2 transition-colors"
              >
                <Settings className="size-5" />
              </motion.button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Schedule Settings</SheetTitle>
                <SheetDescription>
                  Customize your schedule view
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Show 24 Hours</label>
                  <Switch
                    checked={show24Hours}
                    onCheckedChange={setShow24Hours}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cell Width</label>
                  <Slider
                    value={[cellWidth]}
                    onValueChange={([value]) => setCellWidth(value)}
                    min={100}
                    max={200}
                    step={1}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="relative flex">
        <div className="sticky left-0 z-20 w-20 shadow-md">
          <div className="h-20 border-b border-r" />
          {days.map((day, idx) => (
            <motion.div
              key={day.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex h-20 items-center justify-center border-b border-r font-medium"
            >
              <span className="-rotate-45 text-sm">{day.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          <div
            ref={timeHeaderRef}
            className="sticky top-0 z-10 flex h-20 overflow-x-hidden shadow-sm"
          >
            {visibleTimeSlots.map((hour, idx) => (
              <motion.div
                key={hour}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="shrink-0 border-b border-r"
                style={{ width: `${cellWidth}px` }}
              >
                <div className="flex h-full items-center justify-center gap-1">
                  <Clock className="size-4 text-blue-600" />
                  <span className="text-sm font-medium">{`${hour.toString().padStart(2, "0")}:00`}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            ref={contentRef}
            className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 overflow-x-auto"
          >
            {days.map((day) => (
              <div key={day.label} className="relative flex">
                {visibleTimeSlots.map((hour) => (
                  <div
                    key={`${day.value}-${hour}`}
                    className="bg-background shrink-0 border-b border-r"
                    style={{
                      width: `${cellWidth}px`,
                      height: "80px",
                    }}
                  />
                ))}

                <AnimatePresence>
                  {classes
                    .filter((cls) => cls.day === day.value)
                    .map((cls) => (
                      <div
                        key={cls.id}
                        className="absolute top-0"
                        style={{
                          left: `${cellWidth * getClassPosition(cls.from)}px`,
                        }}
                      >
                        <ClassBox
                          classInfo={cls}
                          cellWidth={cellWidth}
                          onClick={setSelectedClass}
                          isActive={selectedClass?.id === cls.id}
                        />
                      </div>
                    ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedClass}
        onOpenChange={() => setSelectedClass(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-xl">{selectedClass?.course_title}</span>
              <span className="text-sm text-gray-500">
                ({selectedClass?.course_code})
              </span>
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-semibold">Time</div>
                  <div>
                    {selectedClass &&
                      `${formatTime(selectedClass.from)} - ${formatTime(selectedClass.to)}`}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Room</div>
                  <div>{selectedClass?.room}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Professor</div>
                  <div>{selectedClass?.prof}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Type</div>
                  <div className="capitalize">{selectedClass?.type}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Branch</div>
                  <div>{selectedClass?.branch}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold">Group</div>
                  <div>{selectedClass?.group}</div>
                </div>
              </div>

              {/* 
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-md bg-gray-50 p-4"
              >
                <h4 className="mb-2 text-sm font-semibold">Next Occurrence</h4>
                <div className="text-sm">
                  {selectedClass &&
                    new Date(selectedClass.from).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                </div>
              </motion.div>
               */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Loading overlay */}
      <AnimatePresence>
        {!classes.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="justify-center/80 absolute inset-0 flex items-center backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="size-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm">Loading schedule...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
