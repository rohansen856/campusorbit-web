"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Institute } from "@prisma/client"
import { Separator } from "@radix-ui/react-dropdown-menu"
import axios from "axios"
import { Plus } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { scheduleArraySchema } from "@/lib/validation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { DefaultRow } from "./DefaultRow"
import { ScheduleRow } from "./ScheduleRow"

type FormData = z.infer<typeof scheduleArraySchema>

export function ScheduleForm() {
  const [institutes, setInstitutes] = useState<Institute[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(scheduleArraySchema),
    defaultValues: {
      schedules: Array(10).fill({
        type: "theory",
        group: "",
      }),
    },
  })

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "schedules",
  })

  useEffect(() => {
    axios
      .get<Institute[]>("/api/institutes")
      .then((response) => {
        setInstitutes(response.data.toSorted())
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load institutes",
        })
      })
  }, [toast])

  const handleDefaultChange = (
    field: keyof FormData["schedules"][number],
    value: any
  ) => {
    const { setValue } = form
    fields.forEach((_, index) => {
      setValue(`schedules.${index}.${field}`, value)
    })
  }

  const handleInsertRow = async (index: number) => {
    try {
      setIsLoading(true)
      const rowData = form.getValues(`schedules.${index}`)
      await axios.post("/api/schedule/batch", { schedules: [rowData] })
      toast({
        title: "Success",
        description: "Schedule created successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create schedule",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true)
      const validSchedules = data.schedules.filter(
        (schedule) => schedule.course_code && schedule.course_title
      )

      await axios.post("/api/schedule/batch", { schedules: validSchedules })
      toast({
        title: "Success",
        description: "Schedules created successfully",
      })
      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create schedules",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addMoreRows = () => {
    Array(10)
      .fill(undefined)
      .forEach(() => {
        append({
          type: "theory",
          institute_id: 0,
          course_code: "",
          course_title: "",
          prof: "",
          day: 0,
          from: new Date(),
          to: new Date(),
          group: "",
          branch: "",
          room: "",
          semester: 0,
        })
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] space-y-4">
            <DefaultRow
              form={form}
              institutes={institutes}
              onDefaultChange={handleDefaultChange}
            />

            <div className="space-y-2">
              {fields.map((field, index) => (
                <>
                  <ScheduleRow
                    key={field.id}
                    form={form}
                    index={index}
                    institutes={institutes}
                    onInsertRow={handleInsertRow}
                    isLoading={isLoading}
                  />
                  <Separator
                    className={cn(
                      "bg-secondary h-1",
                      (index + 1) % 10 === 0 ? "block" : "hidden"
                    )}
                  />
                </>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMoreRows}
          >
            <Plus className="mr-2 size-4" />
            Add More Rows
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Schedules"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
