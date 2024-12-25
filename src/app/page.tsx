import { FeaturesSection } from "@/components/home/features"
import { HeroSection } from "@/components/home/hero"
import { StatsSection } from "@/components/home/stats"
import { TestimonialsSection } from "@/components/home/testimonials"
import { currentUser } from "@/lib/authentication"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await currentUser()
  if(user)return redirect("/dashboard")
  return (
    <div className="min-h-screen relative">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  )
}
