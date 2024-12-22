"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Check, Loader, Pencil, Trash2, X } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { PostSchemaType } from "@/lib/validation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type MyPostItemProps = {
  post: PostSchemaType
  onDelete: (postId: string) => Promise<void>
  onUpdate: (postId: string, content: string) => Promise<void>
}

export function MyPostItem({ post, onDelete, onUpdate }: MyPostItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function parseContent() {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(post.content)
    const parsedContent = file.value.toString()
    setContent(parsedContent)
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsLoading(true)
      await onDelete(post.id.toString())
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    setIsLoading(true)
    await onUpdate(post.id.toString(), content)
    setIsLoading(false)
    setIsEditing(false)
  }

  useEffect(() => {
    parseContent()
  }, [post])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-secondary/50 rounded shadow-sm p-4 mb-2"
    >
      <div className="flex items-start space-x-4">
        <div className="relative h-12 w-12 rounded-full border border-primary/10 overflow-hidden">
          <Avatar className="size-12">
            <AvatarImage
              src={post.user.profile_image || ""}
              alt={post.user.username}
              className="size-12 object-contain"
            />
            <AvatarFallback className="size-12">{"C"}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{post.user.username}</span>
              <span className="text-gray-500 text-sm ml-2">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex space-x-2">
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin text-gray-500" />
              ) : (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              minRows={2}
            />
          ) : (
            <p className="mt-2 text-gray-800 dark:text-gray-200">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </p>
          )}

          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>{post._count.likes} likes</span>
            <span>{post._count.comments} comments</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
