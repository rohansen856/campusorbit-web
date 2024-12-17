import { currentUser } from "@/lib/authentication"
import { StudentRegistrationForm } from "./form"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
    const user = await currentUser()
    if (!user) return redirect("/auth/login")

    return (
        <div className="min-h-screen flex items-center justify-center">
            <StudentRegistrationForm />
        </div>
    )
}
