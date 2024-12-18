import { ProfileSection } from "@/components/dashboard/profile-section"
import { ScheduleSection } from "@/components/dashboard/schedules"
import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

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
        <div className="w-full flex gap-8 flex-col md:flex-row">
            <ProfileSection
                user={{ name: user.name ?? "" }}
                student={student}
            />
            <div className="hidden md:block w-full md:w-2/5 md:border-l">
                <ScheduleSection />
            </div>
        </div>
    )
}
