"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Pie,
  PieChart,
  Rectangle,
  RectangleProps,
  Sector,
  XAxis,
} from "recharts"
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

const CustomBar = ({ ...props }: RectangleProps) => {
  const { fill, x, y, width, height, color } = props
  const minHeight = 4

  return (
    <Rectangle
      {...props}
      fill={color ? color : fill}
      y={
        height && height > minHeight
          ? y
          : (y as number) - (minHeight - (height as number))
      }
      height={Math.max(minHeight, height as number)}
    />
  )
}

export function TotalAttendance({
  subjects,
  attendanceData,
  ...props
}: TotalAttendanceProps) {
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

  let i = 0
  const result: {
    course_code: string
    present: number
    absent: number
  }[] = Object.values(
    attendanceData
      .flatMap((item) => item.details)
      .reduce(
        (
          acc: Record<
            string,
            {
              course_code: string
              present: number
              absent: number
              fill: string
            }
          >,
          { course_code, status }
        ) => {
          acc[course_code] = acc[course_code] || {
            course_code,
            present: 0,
            absent: 0,
            fill: "",
          }
          if (status === "PRESENT") {
            acc[course_code].present += 1
          } else if (status === "ABSENT") {
            acc[course_code].absent += 1
          }
          i++
          return acc
        },
        {}
      )
  )

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Total Attendance</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="mt-12 md:mt-32">
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={result}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="course_code"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
              />
              <Bar
                dataKey="present"
                shape={<CustomBar color={"hsl(var(--chart-1))"} />}
                radius={4}
              >
                <LabelList
                  dataKey="present"
                  position="centerBottom"
                  className="fill-primary"
                  fontSize={20}
                />
              </Bar>
              <Bar
                dataKey="absent"
                shape={<CustomBar color={"hsl(var(--chart-2))"} />}
                radius={4}
              >
                <LabelList
                  dataKey="absent"
                  position="centerBottom"
                  className="fill-primary"
                  fontSize={20}
                />
              </Bar>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-[180px]"
                    formatter={(value, name, item) => {
                      if (!item || !item.payload) {
                        return null // Return null if item or item.payload is undefined
                      }
                      return (
                        <>
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                            style={
                              {
                                "--color-bg": `var(--color-${name})`,
                              } as React.CSSProperties
                            }
                          />
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            {value}
                            <span className="font-normal text-muted-foreground">
                              classes
                            </span>
                          </div>
                          {/* Add total after the last item */}
                          {name === "absent" && (
                            <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                              Total
                              <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                {(item.payload.present || 0) +
                                  (item.payload.absent || 0)}
                                <span className="font-normal text-muted-foreground">
                                  classes
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    }}
                  />
                }
                cursor={false}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
