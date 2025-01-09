"use client"

import { Institute, Schedule } from "@prisma/client"
import { UseFormReturn } from "react-hook-form"

import { days } from "@/lib/data"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { TimeInput } from "./TimeInput"

interface DefaultRowProps {
  form: UseFormReturn<any>
  institutes: Institute[]
  onDefaultChange: (field: keyof Omit<Schedule, "id">, value: any) => void
}

export function DefaultRow({
  form,
  institutes,
  onDefaultChange,
}: DefaultRowProps) {
  return (
    <div className="bg-muted/30 grid grid-cols-12 gap-2 rounded-lg p-2">
      <div className="text-muted-foreground col-span-1 flex items-center justify-center font-medium">
        Default
      </div>

      <div className="col-span-1">
        <Select
          onValueChange={(value) =>
            onDefaultChange("institute_id", parseInt(value))
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map((institute) => (
              <SelectItem key={institute.id} value={institute.id.toString()}>
                {institute.short_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <Input
          className="h-8"
          placeholder="Code"
          onChange={(e) => onDefaultChange("course_code", e.target.value)}
        />
      </div>

      <div className="col-span-2">
        <Input
          className="h-8"
          placeholder="Title"
          onChange={(e) => onDefaultChange("course_title", e.target.value)}
        />
      </div>

      <div className="col-span-1">
        <Input
          className="h-8"
          placeholder="Prof"
          onChange={(e) => onDefaultChange("prof", e.target.value)}
        />
      </div>

      <div className="col-span-1">
        <Select onValueChange={(value) => onDefaultChange("type", value)}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="theory">Theory</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <Select
          onValueChange={(value) => onDefaultChange("day", parseInt(value))}
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day, i) => (
              <SelectItem key={i} value={i.toString()}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="col-span-1">
        <TimeInput
          form={form}
          index={-1}
          isDefault
          onTimeChange={onDefaultChange}
        />
      </div>

      <div className="col-span-1">
        <Input
          className="h-8"
          placeholder="Group"
          onChange={(e) => onDefaultChange("group", e.target.value)}
        />
      </div>

      <div className="col-span-1">
        <Input
          className="h-8"
          placeholder="Branch"
          onChange={(e) => onDefaultChange("branch", e.target.value)}
        />
      </div>
      <div className="col-span-1">
        <Input
          className="h-8"
          placeholder="Sem"
          onChange={(e) => onDefaultChange("semester", e.target.value)}
        />
      </div>
    </div>
  )
}
