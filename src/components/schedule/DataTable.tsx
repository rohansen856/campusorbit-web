"use client"

import { Schedule } from "@prisma/client"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataTableProps {
  data: Schedule[]
  isLoading: boolean
  onInsert: (rows: Schedule[]) => Promise<void>
}

export function DataTable({ data, isLoading, onInsert }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Institute</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>Course Title</TableHead>
            <TableHead>Professor</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.institute_id}</TableCell>
              <TableCell>{row.course_code}</TableCell>
              <TableCell>{row.course_title}</TableCell>
              <TableCell>{row.prof}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.day}</TableCell>
              <TableCell>{format(row.from, "PPP")}</TableCell>
              <TableCell>{format(row.to, "PPP")}</TableCell>
              <TableCell>{row.group}</TableCell>
              <TableCell>{row.branch}</TableCell>
              <TableCell>{row.room}</TableCell>
              <TableCell>{row.semester}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onInsert([row])}
                  disabled={isLoading}
                >
                  Insert
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end p-4">
        <Button
          onClick={() => onInsert(data)}
          disabled={isLoading || !data.length}
        >
          Insert All
        </Button>
      </div>
    </div>
  )
}
