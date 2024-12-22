import { TrendingSection } from "@/components/home/trending-section"
import { ScrollToTopButton } from "@/components/scroll-to-top"

import { AllPostsSection } from "./all-post-section"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <div className="flex">
          <AllPostsSection />
          <TrendingSection />
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  )
}
