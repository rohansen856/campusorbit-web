"use client"

import { useEffect, useState } from "react"
import { type Post } from "@prisma/client"
import axios from "axios"
import { motion } from "framer-motion"
import { Calendar, TrendingUp } from "lucide-react"

type TrendingPost = {
  id: number
  userId: string
  content: string
  createdAt: Date
  user: {
    username: string
    profile_image: string | null
    verified: boolean
    user: {
      name: string | null
    }
  }
  likes: Array<{
    id: number
    postId: number
    userId: string
    createdAt: Date
  }>
  _count: {
    comments: number
    likes: number
  }
}

type TrendingResponse = {
  year: TrendingPost[]
  month: TrendingPost[]
  week: TrendingPost[]
  day: TrendingPost[]
}

type TimeRange = "day" | "week" | "month" | "year"

export function TrendingSection() {
  const [trendingPosts, setTrendingPosts] = useState<TrendingResponse | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timeRanges: TimeRange[] = ["day", "week", "month", "year"]

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const res = await axios.get("/api/posts/trending")
        setTrendingPosts(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrendingPosts()
  }, [])

  if (error) {
    return (
      <div className="w-full bg-secondary rounded-lg shadow-sm p-4">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-full min-w-[330px] bg-secondary rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending
        </h2>
        <div className="animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="mb-6">
              <div className="h-4 bg-primary/20 rounded w-32 mb-3" />
              {[1, 2].map((j) => (
                <div
                  key={j}
                  className="mb-3 p-3 rounded-lg bg-primary/20 dark:bg-gray-700"
                >
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-primary/20 rounded mr-3" />
                    <div className="flex-1">
                      <div className="h-4 bg-primary/20 rounded w-24 mb-2" />
                      <div className="h-3 bg-primary/20 rounded w-full mb-2" />
                      <div className="h-3 bg-primary/20 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!trendingPosts) {
    return null
  }

  return (
    <div className="w-full max-w-[330px]">
      <div className="bg-secondary rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending
        </h2>

        {timeRanges.map((range, i) => (
          <motion.div
            key={range + i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h3 className="text-sm font-medium text-primary/60 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Trending this {range}
            </h3>

            {trendingPosts[range].length === 0 ? (
              <p className="pl-8 italic">No posts found for this {range}</p>
            ) : (
              (trendingPosts[range] || []).map((post, index) => (
                <motion.div
                  key={post.id + index}
                  whileHover={{ scale: 1.02 }}
                  className="mb-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-start">
                    <span className="text-2xl font-bold text-gray-300 mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">
                        {post.user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {post.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {post._count.likes.toLocaleString()} likes
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
