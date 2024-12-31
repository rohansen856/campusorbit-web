import { Merch } from "@prisma/client"
import { z } from "zod"

import { branches } from "./data"

export const ogImageSchema = z.object({
  heading: z.string(),
  type: z.string(),
  mode: z.enum(["light", "dark"]).default("dark"),
})

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

export const postSchema = z.object({
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

export type PostSchemaType = z.infer<typeof postSchema>

export const studentVerificationSchema = z.object({
  collegeEmail: z
    .string()
    .email("Invalid email address")
    .endsWith(".ac.in", "Must be a valid college email"),
  idCardImage: z
    .string()
    .startsWith("https://utfs.io", { message: "Invalid image url" }),
  portraitImage: z
    .string()
    .startsWith("https://utfs.io", { message: "Invalid image url" }),
  holdingIdImage: z
    .string()
    .startsWith("https://utfs.io", { message: "Invalid image url" }),
})

export type StudentVerificationFormData = z.infer<
  typeof studentVerificationSchema
>

const colorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hexCode: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color code"),
})

export const merchSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  thumbnailImage: z.string().url("Invalid image URL"),
  price: z
    .number()
    .positive("Price must be positive")
    .min(0.01, "Price must be at least 0.01"),
  category: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(colorSchema).min(1, "At least one color is required"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .positive("Stock must be positive"),
  featured: z.boolean().default(false),
})

export type MerchFormData = z.infer<typeof merchSchema>

export type MerchCardType = Merch & {
  club: {
    institute: {
      short_name: string
    }
    name: string
    clubType: string
    institute_id: number
  }
}
