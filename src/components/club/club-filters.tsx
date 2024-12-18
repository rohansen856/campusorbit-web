"use client"

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
  type: string
  search: string
  onTypeChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export function ClubFilters({
  type,
  search,
  onTypeChange,
  onSearchChange,
}: ClubFiltersProps) {
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

      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Select club type" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">All Clubs</SelectItem> */}
          {CLUB_TYPES.map((clubType) => (
            <SelectItem key={clubType.value} value={clubType.value}>
              <span className="flex items-center gap-2">
                {clubType.icon} {clubType.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
