import { redirect } from "next/navigation"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

import { StudentRegistrationForm } from "./form"

export default async function RegisterPage() {
  const user = await currentUser()
  if (!user) return redirect("/auth/sign-in")
  const student = await db.student.findUnique({
    where: {
      user_id: user.id,
    },
    select: { id: true },
  })
  if (student) return redirect("/dashboard")

  return (
    <div className="flex items-center justify-center">
      <StudentRegistrationForm />
    </div>
  )
}
