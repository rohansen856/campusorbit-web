import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

const imageUploadSchema = z.object({
  imageUrl: z.string().url(),
  imageFor: z.enum(["profile", "banner"]),
})

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) return new Response("Unauthorized", { status: 401 })

    const body = await req.json()
    console.log(body)
    const { imageUrl, imageFor } = imageUploadSchema.parse(body)

    await db.student.update({
      where: {
        user_id: user.id,
      },
      data:
        imageFor === "profile"
          ? { profile_image: imageUrl }
          : { background_banner: imageUrl },
    })

    return new Response("Image uploaded", { status: 201 })
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError)
      return new Response("Invalid data", { status: 400 })
    return new Response("Error", { status: 500 })
  }
}
