import { NextResponse } from "next/server"
import { z } from "zod"

import { db } from "@/lib/db"
import { scheduleSchema } from "@/lib/validation"

const scheduleValidator = z.array(scheduleSchema)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const schedules = scheduleValidator.parse(
      Array.from(body.schedules).map((i: any) => ({
        ...i,
        from: new Date(i.from),
        to: new Date(i.to),
        semester: parseInt(i.semester),
      }))
    )

    // Process in batches of 10
    const results = []
    for (let i = 0; i < schedules.length; i += 10) {
      const batch = schedules.slice(i, i + 10)
      try {
        const result = await db.$transaction(
          batch.map((schedule) =>
            db.schedule.create({
              data: schedule,
            })
          )
        )
        results.push(...result)
      } catch (error) {
        console.log(error)
        return NextResponse.json(
          { error: `Failed to insert batch starting at index ${i}` },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error(JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: "Failed to process schedules" },
      { status: 500 }
    )
  }
}
