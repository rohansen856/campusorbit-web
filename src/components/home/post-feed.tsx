"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import InfiniteScroll from "react-infinite-scroll-component"

import { Post } from "@/components/home/post"

export type UserType = {
  id: string
  username: string
  email: string
}

export type PostType = {
  id: string
  content: string
  createdAt: string
  user: UserType
  _count: {
    likes: number
    comments: number
  }
}

export type SearchFilter = "all" | "users" | "mentions"

type PostFeedProps = {
  isSearchActive: boolean
  searchResults: PostType[]
}

export function PostFeed({ isSearchActive, searchResults }: PostFeedProps) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (isSearchActive) {
      setPosts(searchResults)
      setHasMore(false)
    } else {
      fetchPosts()
    }
  }, [searchResults, isSearchActive])

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`/api/posts`, {
        params: {
          cursor,
        },
      })
      const { data } = res

      if (data.posts.length === 0) {
        setHasMore(false)
        return
      }

      setPosts((prev) => [...prev, ...data.posts])
      setCursor(data.nextCursor)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchPosts}
      hasMore={hasMore}
      loader={<div className="p-4 text-center">Loading...</div>}
      endMessage={<div className="p-4 text-center">No more posts</div>}
    >
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={`${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="overflow-hidden"
          >
            <Post post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </InfiniteScroll>
  )
}
