import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

export async function ClubSection() {
  const user = await currentUser()
  if (!user) return null

  const clubs = await db.club.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  })

  console.log(clubs)

  return (
    <section className="w-full min-h-[400px] bg-blue-700/30 rounded-xl p-6"></section>
  )
}
