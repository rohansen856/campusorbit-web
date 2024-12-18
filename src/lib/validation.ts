import { z } from "zod"

export const studentSchema = z.object({
    username: z.string().min(1, "Username is required"),
    semester: z.number().int().min(1).max(12),
    roll_number: z.string().min(1, "Roll number is required"),
    enrollment_year: z.number().int().min(2000).max(new Date().getFullYear()),
    graduation_year: z.number().int().min(2000).optional().nullable(),
    branch: z.enum([
        "CSE",
        "ECE",
        "EEE",
        "ME",
        "CE",
        "IT",
        "DS",
        "AI",
        "CS",
        "CH",
        "BT",
    ]),
    group: z.string().default(""),
    institute_id: z.number().int().positive(),
})

export type StudentFormData = z.infer<typeof studentSchema>

// TypeScript Type
export type Routine = {
    id: string
    course_code: string
    course_title: string
    prof: string
    type?: "theory" | "lab"
    day: number // 1 (Monday) to 7 (Sunday)
    from: string // Time in HH:MM format
    to: string // Time in HH:MM format
    group: string
    branch: "CSE" | "ECE" | "SM" | "ME" | "DS"
    institute: string
    room: string
    semester: number
}

export const RoutineSchema = z.object({
    id: z.string().optional(),
    course_code: z.string(),
    course_title: z.string(),
    prof: z.string(),
    type: z.enum(["theory", "lab", "tutorial"]).optional().default("theory"),
    day: z.number().min(1).max(7),
    from: z.string().regex(/^\d{2}:\d{2}$/),
    to: z.string().regex(/^\d{2}:\d{2}$/),
    group: z.string().optional().default(""),
    branch: z.enum(["CSE", "ECE", "SM", "ME", "DS"]),
    institute_id: z.number().positive(),
    room: z.string(),
    semester: z.number().positive().min(1).max(8),
})

export type RoutineType = z.infer<typeof RoutineSchema>
