import { z } from "zod"

import { branches } from "./data"

export const studentSchema = z.object({
  username: z.string().min(1, "Username is required"),
  semester: z.number().int().min(1).max(12),
  roll_number: z.string().min(1, "Roll number is required"),
  enrollment_year: z.number().int().min(2000).max(new Date().getFullYear()),
  graduation_year: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 10),
  branch: z.enum(["", ...branches.map((branch) => branch.key)]),
  group: z.string().default(""),
  institute_id: z.number().int().positive(),
})

export type StudentFormData = z.infer<typeof studentSchema>

export const socialsSchema = z.object({
  github: z.string().url().or(z.string().min(1)).nullable(),
  linkedin: z.string().url().or(z.string().min(1)).nullable(),
  twitter: z.string().url().or(z.string().min(1)).nullable(),
  instagram: z.string().url().or(z.string().min(1)).nullable(),
  discord: z.string().url().or(z.string().min(1)).nullable(),
})

export type SocialsFormData = z.infer<typeof socialsSchema>

export type Socials = SocialsFormData & { id: string; userId: string }
