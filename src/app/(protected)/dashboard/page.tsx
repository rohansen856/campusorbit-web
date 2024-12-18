import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { ProfileSection } from "@/components/dashboard/profile-section"
import { ScheduleSection } from "@/components/dashboard/schedules"

export default async function ProfilePage() {
  const user = await currentUser()
  if (!user) return null
  const student = await db.student.findUnique({
    where: {
      user_id: user.id,
    },
    select: {
      id: true,
      username: true,
      verified: true,
      profile_image: true,
      background_banner: true,
      institute: {
        select: {
          id: true,
          name: true,
          short_name: true,
          logo_url: true,
          website_url: true,
        },
      },
    },
  })
  if (!student) return null

  return (
    <div>
      <div className="w-full flex gap-8 flex-col md:flex-row">
        <ProfileSection user={{ name: user.name ?? "" }} student={student} />
        <div className="md:block w-full md:w-2/5 md:border-l border-t md:border-t-0 py-4 md:pt-0">
          <ScheduleSection />
        </div>
      </div>
      <section className="container">
        <div></div>
      </section>
    </div>
  )
}
