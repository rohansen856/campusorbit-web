import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const day = searchParams.get("day")
        const branch = searchParams.get("branch")
        const group = searchParams.get("group")
        const semester = searchParams.get("semester")

        const where = {
            ...(day && { day: parseInt(day) }),
            ...(branch && { branch }),
            ...(group && { group }),
            ...(semester && { semester: parseInt(semester) }),
        }

        const schedules = await db.schedule.findMany({
            where,
            orderBy: [{ day: "asc" }, { from: "asc" }],
        })

        return NextResponse.json(schedules)
    } catch (error) {
        console.error("Failed to fetch schedules:", error)
        return NextResponse.json(
            { error: "Failed to fetch schedules" },
            { status: 500 }
        )
    }
}
