"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { PostSchemaType } from "@/lib/validation"
import { Post } from "@/components/home/post"

export type UserType = {
  id: string
  username: string
  email: string
}

export type SearchFilter = "all" | "users" | "mentions" | "institutes" | "clubs"

type PostFeedProps = {
  isSearchActive: boolean
  searchResults: PostSchemaType[]
}

export function PostFeed({ isSearchActive, searchResults }: PostFeedProps) {
  const [posts, setPosts] = useState<PostSchemaType[]>([])
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
      loader={
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center py-12"
        >
          <Loader className="size-6 animate-spin" />
        </motion.div>
      }
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
            className="overflow-hidden border border-t-0"
          >
            <Post post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </InfiniteScroll>
  )
}
