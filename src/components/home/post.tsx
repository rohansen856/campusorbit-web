"use client"

import { useEffect, useState } from "react"
import { HeartFilledIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageSquare,
  Share,
} from "lucide-react"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { toast } from "sonner"
import { unified } from "unified"

import { cn } from "@/lib/utils"
import { PostSchemaType } from "@/lib/validation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { Badge } from "../ui/badge"

type PostProps = {
  post: PostSchemaType
}

export function Post({ post }: PostProps) {
  const [content, setContent] = useState("")
  const [isLiked, setIsLiked] = useState(post.likes.length > 0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowExpand, setShouldShowExpand] = useState(false)
  const CONTENT_PREVIEW_HEIGHT = 220

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

  async function likePost() {
    try {
      await axios.post(`/api/posts/like/${post.id}`)
      setIsLiked(!isLiked)
      toast.success("You liked the post!")
    } catch (error) {
      toast.error("Failed to like the post!")
    }
  }

  useEffect(() => {
    parseContent()
  }, [post])

  useEffect(() => {
    if (content) {
      const contentEl = document.createElement("div")
      contentEl.innerHTML = content
      document.body.appendChild(contentEl)
      const contentHeight = contentEl.offsetHeight
      document.body.removeChild(contentEl)
      setShouldShowExpand(contentHeight > CONTENT_PREVIEW_HEIGHT)
    }
  }, [content])

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden border-0">
      <CardHeader className="flex flex-row items-center justify-center space-x-4 p-4 border-b">
        <Avatar className="size-12">
          <AvatarImage
            src={post.user.profile_image || ""}
            alt={post.user.user.name || post.user.username}
            className="size-12 object-contain"
          />
          <AvatarFallback className="size-12">
            {post.user.user.name?.[0] || post.user.username[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg flex gap-4 items-center font-semibold">
            <p>{post.user.user.name || post.user.username}</p>
            {!post.user.verified && (
              <Badge
                variant={"secondary"}
                className={cn(
                  "bg-green-700/10 border-green-700 text-green-700"
                )}
              >
                verified <Check className="size-4" />{" "}
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">@{post.user.username}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <AnimatePresence initial={false}>
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? "auto" : CONTENT_PREVIEW_HEIGHT,
              opacity: 1,
            }}
            className="relative"
          >
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                !isExpanded && "max-h-[220px]"
              )}
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {shouldShowExpand && !isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
            )}
          </motion.div>
        </AnimatePresence>
        {shouldShowExpand && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show more
              </>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-end p-2 border-t gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-background hover:text-rose-500 border border-rose-700/50"
          onClick={likePost}
        >
          {isLiked ? (
            <HeartFilledIcon className="mr-2 h-4 w-4 text-rose-700" />
          ) : (
            <Heart className="mr-2 h-4 w-4" />
          )}

          {post._count.likes + post.likes.length === 0 ? (isLiked ? +1 : 0) : 0}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-background hover:text-indigo-500 border border-indigo-700/50"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          {post._count.comments}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-background hover:text-blue-500 border border-blue-700/50"
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  )
}
