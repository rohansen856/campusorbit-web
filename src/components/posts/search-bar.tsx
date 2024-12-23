"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Building, Club, Hash, Search, User } from "lucide-react"

import { FilterButton } from "@/components/posts/filter-button"

import { SearchFilter } from "./post-feed"

type SearchBarProps = {
  onSearch: (query: string, filter: SearchFilter) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<SearchFilter>("all")

  const handleSearch = (e: React.FormEvent) => {
    e?.preventDefault()
    onSearch(query, filter)
  }

  useEffect(() => {
    const debounce = setTimeout(handleSearch, 700)
    return () => clearTimeout(debounce)
  }, [query, filter])

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search posts..."
        />
      </form>
      <div className="flex gap-2 mt-2">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          icon={<Search className="h-4 w-4" />}
          label="All"
        />
        <FilterButton
          active={filter === "users"}
          onClick={() => setFilter("users")}
          icon={<User className="h-4 w-4" />}
          label="Users"
        />
        <FilterButton
          active={filter === "mentions"}
          onClick={() => setFilter("mentions")}
          icon={<Hash className="h-4 w-4" />}
          label="Mentions"
        />
        <FilterButton
          active={filter === "institutes"}
          onClick={() => setFilter("institutes")}
          icon={<Building className="h-4 w-4" />}
          label="Institutes"
        />
        <FilterButton
          active={filter === "clubs"}
          onClick={() => setFilter("clubs")}
          icon={<Club className="h-4 w-4" />}
          label="Clubs"
        />
      </div>
    </div>
  )
}
