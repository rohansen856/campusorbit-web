"use client"

import { useEffect, useState } from "react"
import { Institute } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { Check, Search } from "lucide-react"

import { branches, semesters } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
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

interface UserFiltersProps {
  onFilterChange: (filters: any) => void
}

export function UserFilters({ onFilterChange }: UserFiltersProps) {
  const [institutes, setInstitutes] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    semester: "",
    instituteId: "",
  })

  useEffect(() => {
    axios
      .get("/api/institutes")
      .then((response: AxiosResponse<Institute[]>) => {
        console.log(response.data)
        setInstitutes(response.data.toSorted())
      })
  }, [])

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="bg-background pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="col-span-2 justify-between md:col-span-1"
            >
              {filters.instituteId
                ? institutes.find(
                    (institute) =>
                      institute.id.toString() === filters.instituteId
                  )?.short_name
                : "Select institute..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search institute..." />
              <CommandEmpty>No institute found.</CommandEmpty>
              <CommandGroup>
                {/* {institutes.map((institute) => (
                  <CommandItem
                    value={institute.name}
                    key={institute.id}
                    onSelect={() => {
                      handleFilterChange("instituteId", institute.id.toString())
                    }}
                  >
                    {institute.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        institute.id.toString() === filters.instituteId
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))} */}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Select
          value={filters.branch}
          onValueChange={(value) => handleFilterChange("branch", value)}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.key} value={branch.key}>
                {branch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.semester}
          onValueChange={(value) => handleFilterChange("semester", value)}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester.toString()}>
                Semester {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
