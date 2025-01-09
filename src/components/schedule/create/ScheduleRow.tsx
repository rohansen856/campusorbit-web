"use client"

import { useEffect, useState } from "react"
import { Institute } from "@prisma/client"
import { Loader, Send } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { days } from "@/lib/data"
import { Button } from "@/components/ui/button"
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

interface ScheduleRowProps {
  form: UseFormReturn<any>
  index: number
  institutes: Institute[]
  onInsertRow?: (index: number) => Promise<void>
  isLoading?: boolean
}

export function ScheduleRow({
  form,
  index,
  institutes,
  onInsertRow,
  isLoading,
}: ScheduleRowProps) {
  const [isRowInserting, setIsRowInserting] = useState(false)

  useEffect(() => {
    if (!isLoading) setIsRowInserting(false)
  }, [isLoading])

  return (
    <div className="grid grid-cols-[auto_repeat(13,1fr)_auto] items-center gap-2">
      <div className="text-muted-foreground w-8 text-center text-sm">
        {index + 1}
      </div>

      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`schedules.${index}.institute_id`}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {institutes.map((institute) => (
                    <SelectItem
                      key={institute.id}
                      value={institute.id.toString()}
                    >
                      {institute.short_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.course_code`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="h-8" placeholder="Code" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`schedules.${index}.course_title`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="h-8" placeholder="Title" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.prof`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="h-8" placeholder="Prof" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="theory">Theory</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.day`}
          render={({ field }) => (
            <FormItem>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {days.map((day, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <TimeInput form={form} index={index} />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.group`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="h-8" placeholder="Group" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.branch`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="h-8" placeholder="Branch" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.semester`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  className="h-8"
                  placeholder="Sem"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-1">
        <FormField
          control={form.control}
          name={`schedules.${index}.room`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} className="h-8" placeholder="Room" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setIsRowInserting(true)
            onInsertRow?.(index)
          }}
          disabled={isLoading || isRowInserting}
        >
          {isRowInserting ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
