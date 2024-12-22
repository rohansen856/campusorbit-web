"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share } from "lucide-react"
import { MDXRemote } from "next-mdx-remote"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

type PostProps = {
  post: {
    id: string
    content: string
    createdAt: string
    user: {
      username: string
    }
    _count: {
      likes: number
      comments: number
    }
  }
}

export function Post({ post }: PostProps) {
  const [content, setContent] = useState("")
  async function parseContent() {
    const file = await unified()
      .use(remarkParse) // Convert into markdown AST
      .use(remarkRehype) // Transform to HTML AST
      .use(rehypeSanitize) // Sanitize HTML input
      .use(rehypeStringify) // Convert AST into serialized HTML
      .process(post.content)
    setContent(file.value.toString())
  }
  useEffect(() => {
    parseContent()
  }, [post])
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="border-b p-4 hover:bg-secondary/30 transition-colors"
    >
      <div className="flex space-x-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold">{post.user.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-secondary-foreground">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="mt-2 text-primary">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <div className="mt-4 flex items-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500"
            >
              <Heart className="h-5 w-5" />
              <span>{post._count.likes}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post._count.comments}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500"
            >
              <Share className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
