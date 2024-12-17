import { z } from "zod"

export const studentSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    semester: z.number().int().min(1).max(12),
    roll_number: z.string().min(1, "Roll number is required"),
    profile_image: z.string().url("Invalid profile image URL"),
    background_banner: z.string().url("Invalid background banner URL"),
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
    institute_id: z.number().int().positive(),
})

export type StudentFormData = z.infer<typeof studentSchema>
