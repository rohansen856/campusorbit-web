import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { ClubList } from "@/components/club/club-list"

export default async function ClubsPage() {
  const user = await currentUser()
  if (!user) return null
  const student = await db.student.findUnique({
    where: {
      user_id: user.id,
    },
    select: {
      institute: {
        select: {
          id: true,
        },
      },
    },
  })
  if (!student) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <ClubList instituteId={student.institute.id} />
    </div>
  )
}
