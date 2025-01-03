"use client"

import { Institute } from "@prisma/client"
import { UseFormReturn } from "react-hook-form"

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
}

export function ScheduleRow({ form, index, institutes }: ScheduleRowProps) {
  return (
    <div className="grid grid-cols-12 gap-2">
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
                      {institute.name}
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
                <Input {...field} className="h-8" />
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
                <Input {...field} className="h-8" />
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
                <Input {...field} className="h-8" />
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
                    <SelectValue />
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
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {day}
                      </SelectItem>
                    )
                  )}
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
                <Input {...field} className="h-8" />
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
                <Input {...field} className="h-8" />
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
                <Input {...field} className="h-8" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
