"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { CardTitle } from "@/components/ui/card"
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

interface AttendanceGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  subjects: {
    course_code: string
    course_title: string
  }[]
}

type AttendanceData = {
  status: "PRESENT" | "ABSENT" | "EXCUSED"
  _count: { status: number }
}

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AttendanceGraph({ subjects, ...props }: AttendanceGraphProps) {
  const [selectedSubject, setSelectedSubject] = useState<{
    course_code: string
    course_title: string
  } | null>(subjects[0])

  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [chartData, setChartData] = useState([{ present: 0, absent: 0 }])

  async function getCourseAttendance() {
    try {
      if (!selectedSubject) return
      const res = await axios.get<AttendanceData[]>(
        `/api/attendance/${selectedSubject.course_code}`
      )
      setAttendanceData(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    getCourseAttendance()
  }, [selectedSubject])

  useEffect(() => {
    setChartData([
      {
        ...chartData[0],
        present:
          attendanceData.find((a) => a.status === "PRESENT")?._count.status ||
          0,
        absent:
          attendanceData.find((a) => a.status === "ABSENT")?._count.status || 0,
      },
    ])
  }, [attendanceData])

  return (
    <div className="w-full pr-4 md:pr-0">
      <CardTitle className="text-center mb-2">Course Attendance</CardTitle>
      <Select
        value={selectedSubject?.course_code}
        onValueChange={(value) =>
          setSelectedSubject(
            subjects.find((s) => s.course_code === value) || subjects[0]
          )
        }
      >
        <SelectTrigger className="bg-secondary w-full mb-4">
          <SelectValue placeholder="Select Day" />
        </SelectTrigger>
        <SelectContent>
          {subjects.map((subject) => (
            <SelectItem key={subject.course_code} value={subject.course_code}>
              {subject.course_code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedSubject && chartData[0].absent + chartData[0].present === 0 ? (
        <p className="text-center w-full aspect-square pt-12 italic text-yellow-500">
          No Data Available
        </p>
      ) : subjects.length === 0 ? (
        <div className="aspect-square w-full">
          <p className="text-center py-12 text-yellow-500">
            No attendance data
          </p>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full min-w-[250px] rounded-lg"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
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
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {(
                            (chartData[0].present * 100) /
                            (chartData[0].present + chartData[0].absent)
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
                          Total Classes Recorded:{" "}
                          {chartData[0].present + chartData[0].absent}
                        </tspan>
                        <tspan
                          x={(viewBox.cx || 0) - 56}
                          y={(viewBox.cy || 0) + 56}
                          className="text-lg fill-green-500"
                        >
                          Attended: {chartData[0].present}
                        </tspan>
                        <tspan
                          x={(viewBox.cx || 0) + 56}
                          y={(viewBox.cy || 0) + 56}
                          className="text-lg fill-red-500"
                        >
                          Missed: {chartData[0].absent}
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
  )
}
