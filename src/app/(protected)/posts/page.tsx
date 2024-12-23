import { Toaster } from "sonner"

import { AllPostsSection } from "@/components/posts/all-post-section"
import { SideMenuSection } from "@/components/posts/side-menu"
import { TrendingSection } from "@/components/posts/trending-section"
import { ScrollToTopButton } from "@/components/scroll-to-top"

export default async function Home() {
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
