import { redirect } from "next/navigation"
import { Toaster } from "sonner"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { Footer } from "@/components/footer"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) return null
  const student = await db.student.findUnique({
    where: {
      user_id: user.id,
    },
  })
  if (!student) return redirect("/auth/register")
  return (
    <div className="flex size-full min-h-screen flex-col justify-between px-4">
      <main className="p-4 md:p-8">{children}</main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  )
}
