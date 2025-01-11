"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AttendanceFormData } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Schedule } from "@prisma/client"
import axios from "axios"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, X } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { attendanceFormSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ScrollArea } from "../ui/scroll-area"

type Props = {
  schedules: Schedule[]
}

export function AddAttendanceDialog({ schedules }: Props) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      date: new Date(),
      entries: [{ scheduleId: "", status: "PRESENT" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  })

  async function onSubmit(data: AttendanceFormData) {
    try {
      setIsSubmitting(true)
      const response = await axios.post("/api/attendance/add", data)

      if (response.status !== 201)
        return toast.error("Failed to submit attendance")
      toast.success("Attendance submitted successfully")

      setOpen(false)
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error("Error submitting attendance")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
      case "ABSENT":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
      case "EXCUSED":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
      default:
        return "bg-muted"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-secondary text-primary h-22 hover:bg-secondary group mb-2 w-full gap-2 rounded-xl py-8 text-xl"
        >
          <Plus className="size-4 duration-300 group-hover:rotate-180" />
          Add Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-[425px] flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add Attendance</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col"
          >
            <ScrollArea className="h-[50vh]">
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 size-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative rounded-lg border p-4 shadow-sm transition-all hover:shadow-md dark:hover:shadow-none"
                    >
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name={`entries.${index}.scheduleId`}
                          render={({ field: courseField }) => (
                            <FormItem>
                              <FormLabel>Course</FormLabel>
                              <Select
                                onValueChange={courseField.onChange}
                                value={courseField.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select course..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {schedules.map((schedule) => (
                                    <SelectItem
                                      key={schedule.id}
                                      value={schedule.id}
                                    >
                                      <div className="flex flex-col">
                                        <span>{schedule.course_code}</span>
                                        <span className="text-muted-foreground text-sm">
                                          {schedule.course_title}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`entries.${index}.status`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger
                                    className={cn(
                                      "transition-colors",
                                      field.value && getStatusColor(field.value)
                                    )}
                                  >
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PRESENT">
                                    Present
                                  </SelectItem>
                                  <SelectItem value="ABSENT">Absent</SelectItem>
                                  <SelectItem value="EXCUSED">
                                    Excused
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="bg-background hover:bg-muted absolute -right-2 -top-2 size-6 rounded-full shadow-sm"
                          onClick={() => remove(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => append({ scheduleId: "", status: "PRESENT" })}
                >
                  <Plus className="mr-2 size-4" />
                  Add More
                </Button>
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
