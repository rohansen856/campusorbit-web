"use client"

import { useState } from "react"
import axios from "axios"

import { PostSchemaType } from "@/lib/validation"
import { PostFeed } from "@/components/home/post-feed"
import { SearchBar } from "@/components/home/search-bar"

export function AllPostsSection() {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchResults, setSearchResults] = useState<PostSchemaType[]>([])

  const handleSearch = async (query: string, filter: string) => {
    try {
      if (query.length === 0) {
        return setIsSearchActive(false)
      }
      console.log(query, filter)
      const res = await axios.get<PostSchemaType[]>(`/api/posts/search`, {
        params: { q: query, filter },
      })
      const { data } = res
      setIsSearchActive(true)
      setSearchResults(data)
    } catch (error) {
      console.error("Search failed:", error)
    }
  }
  return (
    <div className="relative w-full">
      <SearchBar onSearch={handleSearch} />
      <PostFeed isSearchActive={isSearchActive} searchResults={searchResults} />
    </div>
  )
}
