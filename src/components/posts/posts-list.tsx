"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { Loader } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import { PostSchemaType } from "@/lib/validation"

import { MyPostItem } from "./post-item"

type MyPostsListProps = {
  onDelete: (postId: string) => Promise<void>
  onUpdate: (postId: string, content: string) => Promise<void>
}

export function MyPostsList({ onDelete, onUpdate }: MyPostsListProps) {
  const [posts, setPosts] = useState<PostSchemaType[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts/my-posts", {
        params: { cursor },
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center py-8"
      >
        <Loader className="h-6 w-6 animate-spin" />
      </motion.div>
    )
  }

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchPosts}
      hasMore={hasMore}
      loader={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center py-8"
        >
          <Loader className="h-6 w-6 animate-spin" />
        </motion.div>
      }
      endMessage={
        <p className="text-center text-gray-500 py-4">No more posts</p>
      }
    >
      <AnimatePresence mode="popLayout">
        {posts.map((post, i) => (
          <MyPostItem
            key={i}
            post={post}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </AnimatePresence>
    </InfiniteScroll>
  )
}
