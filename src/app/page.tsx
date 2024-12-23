"use client"

import { FeaturesSection } from "@/components/home/features"
import { HeroSection } from "@/components/home/hero"
import { StatsSection } from "@/components/home/stats"
import { TestimonialsSection } from "@/components/home/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  )
}
