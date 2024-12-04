"use client"

import { useEffect, useState } from "react"
import { Institute } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { Search } from "lucide-react"

import { CLUB_TYPES } from "@/lib/data"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ClubFiltersProps {
  clubType: string
  institute: number
  search: string
  onTypeChange: (value: string) => void
  onInstituteChange: (value: number) => void
  onSearchChange: (value: string) => void
}

export function ClubFilters({
  clubType,
  institute,
  search,
  onTypeChange,
  onInstituteChange,
  onSearchChange,
}: ClubFiltersProps) {
  const [institutes, setInstitutes] = useState<Institute[]>([])

  useEffect(() => {
    axios
      .get("/api/institutes")
      .then((response: AxiosResponse<Institute[]>) => {
        setInstitutes(response.data.toSorted())
      })
  }, [])

  return (
    <div className="gap-2 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 w-full md:w-[400px]">
        <Select value={clubType} onValueChange={onTypeChange}>
          <SelectTrigger className="col-span-1">
            <SelectValue placeholder="Orientation" />
          </SelectTrigger>
          <SelectContent>
            {CLUB_TYPES.map((clubType) => (
              <SelectItem key={clubType.value} value={clubType.value}>
                <span className="flex items-center gap-2">
                  {clubType.icon} {clubType.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${institute}`}
          onValueChange={(e) => onInstituteChange(parseInt(e) || institute)}
        >
          <SelectTrigger className="col-span-1" defaultValue={institute}>
            <SelectValue placeholder="Select college" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="">All Clubs</SelectItem> */}
            {institutes.map((institute) => (
              <SelectItem key={institute.id} value={`${institute.id}`}>
                <span className="flex items-center gap-2">
                  {institute.short_name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
