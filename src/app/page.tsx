import { redirect } from "next/navigation"

import { currentUser } from "@/lib/authentication"
import { FeaturesSection } from "@/components/home/features"
import { HeroSection } from "@/components/home/hero"
import { StatsSection } from "@/components/home/stats"
import { TestimonialsSection } from "@/components/home/testimonials"

export default async function HomePage() {
  const user = await currentUser()
  if (user) return redirect("/dashboard")
  return (
    <div className="relative min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  )
}
