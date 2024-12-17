import { currentUser } from "@/lib/authentication"
import { StudentRegistrationForm } from "./form"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export default async function RegisterPage() {
    const user = await currentUser()
    if (!user) return redirect("/auth/login")
    const student = await db.student.findUnique({
        where: {
            user_id: user.id,
        },
        select: { id: true },
    })
    if (student) return redirect("/dashboard")

    return (
        <div className="min-h-screen flex items-center justify-center">
            <StudentRegistrationForm />
        </div>
    )
}
