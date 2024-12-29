import { redirect } from "next/navigation"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"

import { VerificationForm } from "./form"

export default async function Home() {
  const user = await currentUser()
  if (!user) return redirect("/auth/sign-in")
  const student = await db.student.findFirst({
    where: { user_id: user.id },
    select: { id: true },
  })
  if (!student) return redirect("/auth/register")
  return (
    <main className="container mx-auto py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">ID Verification</h1>
      <VerificationForm />
    </main>
  )
}
