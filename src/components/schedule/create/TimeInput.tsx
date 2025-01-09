"use client"

import { Schedule } from "@prisma/client"
import { Clock } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TimeInputProps {
  form: UseFormReturn<any>
  index: number
  isDefault?: boolean
  onTimeChange?: (field: keyof Omit<Schedule, "id">, value: Date) => void
}

export function TimeInput({
  form,
  index,
  isDefault,
  onTimeChange,
}: TimeInputProps) {
  const fromTime = isDefault ? null : form.watch(`schedules.${index}.from`)
  const toTime = isDefault ? null : form.watch(`schedules.${index}.to`)

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return [`${hour}:00`, `${hour}:30`]
  }).flat()

  const handleTimeChange = (type: "from" | "to", timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))

    if (isDefault && onTimeChange) {
      onTimeChange(type, date)
    } else {
      form.setValue(`schedules.${index}.${type}`, date)
    }
  }

  return (
    <div className="flex gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-8 w-[4.5rem] justify-start text-left font-normal",
              !fromTime && "text-muted-foreground"
            )}
          >
            {fromTime ? (
              fromTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            ) : (
              <Clock className="mx-auto size-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="grid grid-cols-2 gap-1">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                onClick={() => handleTimeChange("from", time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-8 w-[4.5rem] justify-start text-left font-normal",
              !toTime && "text-muted-foreground"
            )}
          >
            {toTime ? (
              toTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            ) : (
              <Clock className="mx-auto size-4" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="grid grid-cols-2 gap-1">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant="ghost"
                size="sm"
                onClick={() => handleTimeChange("to", time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
