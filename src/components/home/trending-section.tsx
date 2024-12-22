"use client"

import { motion } from "framer-motion"
import { Calendar, TrendingUp } from "lucide-react"

export const demoUsers = [
  { id: "1", username: "johndoe", email: "john@example.com" },
  { id: "2", username: "janedoe", email: "jane@example.com" },
  { id: "3", username: "bobsmith", email: "bob@example.com" },
]

export const demoPosts = [
  {
    id: "1",
    content: "Just launched my new project! 🚀 #coding",
    createdAt: new Date().toISOString(),
    user: demoUsers[0],
    _count: { likes: 15, comments: 5 },
  },
  {
    id: "2",
    content:
      "@johndoe Great work on the project! Looking forward to collaborating",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    user: demoUsers[1],
    _count: { likes: 8, comments: 2 },
  },
  {
    id: "3",
    content: "Learning #TypeScript and loving it! @janedoe any tips?",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    user: demoUsers[2],
    _count: { likes: 12, comments: 4 },
  },
]

export const trendingPosts = {
  day: [
    {
      id: "t1",
      content: "Breaking: Major tech announcement! 🌟",
      user: { username: "techinsider" },
      _count: { likes: 5420 },
    },
    {
      id: "t2",
      content: "New AI breakthrough changes everything!",
      user: { username: "airesearch" },
      _count: { likes: 4230 },
    },
  ],
  week: [
    {
      id: "t3",
      content: "The future of web development is here",
      user: { username: "webdev" },
      _count: { likes: 15200 },
    },
    {
      id: "t4",
      content: "10 tips for better code quality",
      user: { username: "codeguru" },
      _count: { likes: 12100 },
    },
  ],
  month: [
    {
      id: "t5",
      content: "Why TypeScript is taking over",
      user: { username: "typescript" },
      _count: { likes: 45600 },
    },
    {
      id: "t6",
      content: "The rise of microservices",
      user: { username: "cloudarch" },
      _count: { likes: 38900 },
    },
  ],
  year: [
    {
      id: "t7",
      content: "The complete guide to modern JavaScript",
      user: { username: "jsmaster" },
      _count: { likes: 128000 },
    },
    {
      id: "t8",
      content: "Building scalable applications",
      user: { username: "scaleguru" },
      _count: { likes: 98000 },
    },
  ],
}

type TimeRange = "day" | "week" | "month" | "year"

export function TrendingSection() {
  const timeRanges: TimeRange[] = ["day", "week", "month", "year"]

  return (
    <div className="hidden lg:block w-96 ml-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
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
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Trending this {range}
            </h3>

            {trendingPosts[range].map((post, index) => (
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
                    <p className="font-medium text-sm">{post.user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {post.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {post._count.likes.toLocaleString()} likes
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
