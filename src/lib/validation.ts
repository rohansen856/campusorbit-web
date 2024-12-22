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

export const PostSchema = z.object({
  user: z.object({
    user: z.object({
      name: z.string().nullable(),
    }),
    username: z.string(),
    profile_image: z.string().nullable(),
    verified: z.boolean().default(false),
  }),
  likes: z.array(
    z.object({
      id: z.number(),
      postId: z.number(),
      userId: z.string(),
      createdAt: z.date(),
    })
  ),
  _count: z.object({
    comments: z.number(),
    likes: z.number(),
  }),
  id: z.number(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.date(),
})

export type PostSchemaType = z.infer<typeof PostSchema>
