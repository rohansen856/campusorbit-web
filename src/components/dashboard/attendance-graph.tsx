"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Sector,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AttendanceGraphProps {
  subjects: {
    course_code: string
    course_title: string
  }[]
  attendanceData: {
    date: string
    details: { course_code: string; status: string }[]
  }[]
}

type AttendanceData = {
  status: "PRESENT" | "ABSENT" | "EXCUSED"
  _count: { status: number }
}

const radialChartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AttendanceGraph({
  subjects,
  attendanceData,
}: AttendanceGraphProps) {
  const [selectedSubject, setSelectedSubject] = useState<{
    course_code: string
    course_title: string
  } | null>(subjects[0])

  const [courseAttendanceData, setCourseAttendanceData] = useState<
    AttendanceData[]
  >([])
  const [radialChartData, setRadialChartData] = useState([
    { present: 0, absent: 0 },
  ])

  async function getCourseAttendance() {
    try {
      if (!selectedSubject) return
      const res = await axios.get<AttendanceData[]>(
        `/api/attendance/${selectedSubject.course_code}`
      )
      setCourseAttendanceData(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    getCourseAttendance()
  }, [selectedSubject])

  useEffect(() => {
    setRadialChartData([
      {
        present:
          courseAttendanceData.find((a) => a.status === "PRESENT")?._count
            .status || 0,
        absent:
          courseAttendanceData.find((a) => a.status === "ABSENT")?._count
            .status || 0,
      },
    ])
  }, [courseAttendanceData])

  return (
    <Card className="w-full md:h-[64.5vh]">
      <CardHeader>
        <CardTitle>Attendance Percentage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select
            value={selectedSubject?.course_code}
            onValueChange={(value) =>
              setSelectedSubject(
                subjects.find((s) => s.course_code === value) || subjects[0]
              )
            }
          >
            <SelectTrigger className="bg-secondary w-full">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem
                  key={subject.course_code}
                  value={subject.course_code}
                >
                  {subject.course_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSubject &&
          radialChartData[0].absent + radialChartData[0].present === 0 ? (
            <p className="text-center w-full py-12 italic text-yellow-500">
              No Data Available
            </p>
          ) : subjects.length === 0 ? (
            <p className="text-center py-12 text-yellow-500">
              No attendance data
            </p>
          ) : (
            <ChartContainer
              config={radialChartConfig}
              className="mx-auto aspect-square w-full"
            >
              <RadialBarChart
                data={radialChartData}
                endAngle={180}
                innerRadius={150}
                outerRadius={250}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {(
                                (radialChartData[0].present * 100) /
                                (radialChartData[0].present +
                                  radialChartData[0].absent)
                              )
                                .toFixed(2)
                                .toLocaleString()}
                              %
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              Attendance
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 30}
                              className="text-lg fill-primary"
                            >
                              Total Classes:{" "}
                              {radialChartData[0].present +
                                radialChartData[0].absent}
                            </tspan>
                            <tspan
                              x={(viewBox.cx || 0) - 56}
                              y={(viewBox.cy || 0) + 56}
                              className="text-lg fill-green-500"
                            >
                              Present: {radialChartData[0].present}
                            </tspan>
                            <tspan
                              x={(viewBox.cx || 0) + 56}
                              y={(viewBox.cy || 0) + 56}
                              className="text-lg fill-red-500"
                            >
                              Absent: {radialChartData[0].absent}
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="present"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-present)"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="absent"
                  fill="var(--color-absent)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
