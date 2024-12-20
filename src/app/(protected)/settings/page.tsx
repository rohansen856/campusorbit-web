import { UserCog } from "lucide-react"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import UpdatePasswordForm from "@/components/auth/update-password-form"
import UpdateProfileForm from "@/components/auth/update-profile-form"
import { ProfileSection } from "@/components/settings/profile-section"
import SocialMediaForm from "@/components/settings/socials-form"
import StudentEditForm from "@/components/settings/student-edit-form"

export default async function SettingsPage() {
  const user = await currentUser()
  if (!user) return null

  const student = await db.student.findUnique({
    where: {
      user_id: user.id,
    },
    include: {
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

  const socials = await db.socials.findUnique({
    where: {
      userId: user.id,
    },
  })

  return (
    <>
      <h2 className="text-xl md:text-3xl font-bold tracking-tight pb-4 flex items-center">
        <UserCog className="mr-2 w-6 md:w-8 h-auto" />
        Settings
      </h2>
      <div className="w-full flex gap-8 flex-col md:flex-row mb-16">
        <ProfileSection
          user={{ id: user.id, name: user.name ?? "" }}
          student={student}
          socials={socials}
        />
        <Card className="w-full md:w-2/5">
          <CardHeader>
            <h3 className="font-semibold">Update Profile</h3>
          </CardHeader>
          <CardContent>
            <UpdateProfileForm />
          </CardContent>
        </Card>
        {user?.isOAuth === false && (
          <Card className="w-full mt-6">
            <CardHeader>
              <h3 className="font-semibold">Update Password</h3>
            </CardHeader>
            <CardContent>
              <UpdatePasswordForm />
            </CardContent>
          </Card>
        )}
      </div>
      <div className="w-full flex justify-center items-start gap-4 flex-col md:flex-row">
        <StudentEditForm student={student} />
        <SocialMediaForm socials={socials} />
      </div>
    </>
  )
}
