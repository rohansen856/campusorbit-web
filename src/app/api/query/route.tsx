import { NextResponse } from "next/server"
import axios from "axios"
import { z } from "zod"

// Validation schemas
const studentSchema = z.object({
  group: z.string().min(1),
  semester: z.number().int().min(1).max(8),
  branch: z.string().min(2),
  institute_id: z.number().int().positive(),
})

const requestSchema = z.object({
  query: z.string().min(1).trim(),
  student: studentSchema,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const validationResult = requestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid request format",
          details: validationResult.error.issues,
          tokens: 0,
        },
        { status: 400 }
      )
    }

    const { query, student } = validationResult.data

    if (!query.trim()) {
      return NextResponse.json(
        {
          status: "error",
          message: "Query cannot be empty or whitespace",
          tokens: 0,
        },
        { status: 400 }
      )
    }

    const backendUrl = process.env.BACKEND_URL
    if (!backendUrl) {
      return NextResponse.json(
        {
          status: "error",
          message: "Backend URL not configured",
          tokens: 0,
        },
        { status: 500 }
      )
    }

    const response = await axios.post(`${backendUrl}/query`, {
      query,
      student,
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return NextResponse.json(
          error.response.data || {
            status: "error",
            message: "Backend service error",
            tokens: 0,
          },
          { status: error.response.status }
        )
      }
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to backend service",
          tokens: 0,
        },
        { status: 503 }
      )
    }

    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
        tokens: 0,
      },
      { status: 500 }
    )
  }
}
