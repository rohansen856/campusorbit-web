"use client"

import { useEffect, useState } from "react"
import { Institute, Schedule } from "@prisma/client"
import axios from "axios"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DefaultValuesProps {
  defaultValues: Partial<Schedule>
  onChange: (field: keyof Schedule, value: any) => void
}

export function DefaultValues({ defaultValues, onChange }: DefaultValuesProps) {
  const [institutes, setInstitutes] = useState<Institute[]>([])

  useEffect(() => {
    axios.get<Institute[]>("/api/institutes").then((response) => {
      setInstitutes(response.data.toSorted())
    })
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div className="space-y-2">
        <Label>Default Institute</Label>
        <Select
          value={defaultValues.institute_id?.toString()}
          onValueChange={(value) => onChange("institute_id", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map((institute) => (
              <SelectItem key={institute.id} value={institute.id.toString()}>
                {institute.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Default Semester</Label>
        <Select
          value={defaultValues.semester?.toString()}
          onValueChange={(value) => onChange("semester", parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 8 }, (_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                Semester {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add other default value fields */}
    </div>
  )
}
