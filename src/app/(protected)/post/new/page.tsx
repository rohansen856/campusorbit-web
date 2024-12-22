"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import TextareaAutosize from "react-textarea-autosize"

export default function CreatePost() {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) throw new Error("Failed to create post")

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary rounded-lg shadow p-6"
      >
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              minRows={3}
              maxRows={10}
            />
            <p className="text-sm text-gray-500 mt-2">
              {3000 - content.length} characters remaining
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || content.length === 0}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {isSubmitting ? "Posting..." : "Post"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
