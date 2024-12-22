import { Toaster } from "sonner"

import { SideMenuSection } from "@/components/home/side-menu"
import { TrendingSection } from "@/components/home/trending-section"
import { ScrollToTopButton } from "@/components/scroll-to-top"

import { AllPostsSection } from "./all-post-section"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Toaster />
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          <SideMenuSection />
          <AllPostsSection />
          <div className="hidden lg:block w-[500px]">
            <TrendingSection />
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  )
}
