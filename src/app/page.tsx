"use client"

import { useState } from "react"
import axios from "axios"

import { PostFeed } from "@/components/home/post-feed"
import { SearchBar } from "@/components/home/search-bar"
import { TrendingSection } from "@/components/home/trending-section"

export default function Home() {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = async (query: string, filter: string) => {
    try {
      if (query.length === 0) {
        return setIsSearchActive(false)
      }
      console.log(query, filter)
      const res = await axios.get(`/api/posts/search`, {
        params: { q: query, filter },
      })
      const { data } = res
      setIsSearchActive(true)
      setSearchResults(data.results)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  return (
    <div className="min-h-screen">
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <div className="flex">
          <div className="relative w-full">
            <SearchBar onSearch={handleSearch} />
            <PostFeed
              isSearchActive={isSearchActive}
              searchResults={searchResults}
            />
          </div>
          <TrendingSection />
        </div>
      </main>
    </div>
  )
}
