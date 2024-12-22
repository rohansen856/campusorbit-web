"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
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

interface TotalAttendanceProps extends React.HTMLAttributes<HTMLDivElement> {
  subjects: {
    course_code: string
    course_title: string
  }[]
  attendanceData: {
    date: string
    details: { course_code: string; status: string }[]
  }[]
}

export function TotalAttendance({
  subjects,
  attendanceData,
  ...props
}: TotalAttendanceProps) {
  const id = "pie-interactive"
  const [activeCourse, setActiveCourse] = React.useState<string | undefined>(
    undefined
  )

  const chartConfig = {} satisfies ChartConfig

  let i = 0
  const result: { course_code: string; total: number; fill: string }[] =
    Object.values(
      attendanceData
        .flatMap((item) => item.details)
        .reduce(
          (
            acc: Record<
              string,
              { course_code: string; total: number; fill: string }
            >,
            { course_code }
          ) => {
            acc[course_code] = acc[course_code] || {
              course_code,
              total: 0,
              fill: "",
            }
            acc[course_code].total += 1
            acc[course_code].fill = "hsl(var(--chart-" + ((i % 5) + 1) + "))"
            i++
            return acc
          },
          {}
        )
    )

  console.log(result)

  const activeIndex = React.useMemo(
    () => result.findIndex((item) => item.course_code === activeCourse),
    [activeCourse, result]
  )

  return (
    <div data-chart={id} className="w-full pr-4 md:pr-0">
      <ChartStyle id={id} config={chartConfig} />
      <div className="grid gap-2 mb-4">
        <CardTitle className="text-center">Total Classes Recorded</CardTitle>
        <Select value={activeCourse} onValueChange={setActiveCourse}>
          <SelectTrigger
            className="w-full bg-secondary"
            aria-label="Select a course"
          >
            <SelectValue
              placeholder="Select course"
              defaultValue={result[0]?.course_code}
            />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {result.map((item) => (
              <SelectItem
                key={item.course_code}
                value={item.course_code}
                className="rounded-lg [&_span]:flex"
              >
                <p>{item.course_code}</p>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <CardContent className="flex flex-1 flex-col justify-center pb-0 w-full">
        {subjects.length === 0 && (
          <div className="w-full py-12 text-yellow-500 text-center">
            No Data available
          </div>
        )}
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={result}
              dataKey="total"
              nameKey="course_code"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {result[activeIndex]?.total.toLocaleString() ||
                            result.reduce((sum, item) => sum + item.total, 0) ||
                            0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Classes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  )
}
