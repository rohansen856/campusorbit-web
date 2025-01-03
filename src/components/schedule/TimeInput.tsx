"use client"

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
}

export function TimeInput({ form, index }: TimeInputProps) {
  const fromTime = form.watch(`schedules.${index}.from`)
  const toTime = form.watch(`schedules.${index}.to`)

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return [`${hour}:00`, `${hour}:30`]
  }).flat()

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
              <Clock className="size-4" />
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
                onClick={() => {
                  const [hours, minutes] = time.split(":")
                  const date = new Date()
                  date.setHours(parseInt(hours), parseInt(minutes))
                  form.setValue(`schedules.${index}.from`, date)
                }}
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
              <Clock className="size-4" />
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
                onClick={() => {
                  const [hours, minutes] = time.split(":")
                  const date = new Date()
                  date.setHours(parseInt(hours), parseInt(minutes))
                  form.setValue(`schedules.${index}.to`, date)
                }}
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
