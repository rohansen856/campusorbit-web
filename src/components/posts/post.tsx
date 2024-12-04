"use client"

import { useEffect, useState } from "react"
import { HeartFilledIcon } from "@radix-ui/react-icons"
import axios from "axios"
import { formatDistanceToNow } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Loader,
  Loader2,
  MessageSquare,
  Share,
} from "lucide-react"
import rehypeHightlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { toast } from "sonner"
import { unified } from "unified"

import { cn } from "@/lib/utils"
import { PostSchemaType } from "@/lib/validation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { Badge } from "../ui/badge"

type PostProps = {
  post: PostSchemaType
}

export function Post({ post }: PostProps) {
  const [content, setContent] = useState("")
  const [isLiked, setIsLiked] = useState(post.likes.length > 0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowExpand, setShouldShowExpand] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const CONTENT_PREVIEW_HEIGHT = 220

  async function parseContent() {
    try {
      setIsLoading(true)
      setError(null)
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .use(rehypeHightlight)
        .process(post.content)
      const parsedContent = file.value.toString()
      setContent(parsedContent)
    } catch (err) {
      setError("Failed to parse content. Please try again later.")
      toast.error("Failed to load post content")
    } finally {
      setIsLoading(false)
    }
  }

  async function likePost() {
    if (isLikeLoading) return

    try {
      setIsLikeLoading(true)
      const res = await axios.post(`/api/posts/like/${post.id}`)
      setIsLiked(!isLiked)

      if (res.status === 202) {
        toast.success("Post liked!", {
          description: "Your appreciation has been recorded",
        })
      }
      if (res.status === 200) {
        toast.success("Post unliked!", {
          description: "Your like has been removed",
        })
      }
    } catch (error) {
      toast.error("Action failed!", {
        description: "Unable to process your like. Please try again.",
      })
    } finally {
      setIsLikeLoading(false)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-2xl mx-auto overflow-hidden border-0 bg-transparent hover:bg-gray-50/5 transition-colors duration-200">
        <CardHeader className="flex flex-row items-center justify-center space-x-4 p-4 border-b">
          <Avatar className="size-12 ring-2 ring-offset-2 ring-offset-background ring-primary/10">
            <AvatarImage
              src={post.user.profile_image || ""}
              alt={post.user.user.name || post.user.username}
              className="size-12 object-contain"
            />
            <AvatarFallback className="size-12 bg-primary/5">
              {post.user.user.name?.[0] || post.user.username[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg flex gap-4 items-center font-semibold">
              <p>{post.user.user.name || post.user.username}</p>
              {!post.user.verified && (
                <Badge
                  variant="secondary"
                  className="bg-green-700/10 border-green-700 text-green-700 animate-in fade-in-0 duration-300"
                >
                  verified <CheckCircle2 className="size-4 ml-1" />
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{post.user.username}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </p>
        </CardHeader>

        <CardContent className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : CONTENT_PREVIEW_HEIGHT,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div
                  className={cn(
                    "prose prose-neutral dark:prose-invert max-w-none overflow-hidden transition-all duration-300",
                    !isExpanded && "max-h-[220px]"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
                {shouldShowExpand && !isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {shouldShowExpand && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 hover:bg-primary/5"
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
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end p-2 border-t gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hover:bg-background transition-colors duration-200",
              isLiked ? "text-rose-500" : "hover:text-rose-500",
              "border border-rose-700/50"
            )}
            onClick={likePost}
            disabled={isLikeLoading}
          >
            {isLikeLoading ? (
              <Loader className="mr-2 size-4 animate-spin" />
            ) : isLiked ? (
              <HeartFilledIcon className="mr-2 size-4 text-rose-700" />
            ) : (
              <Heart className="mr-2 size-4" />
            )}
            <motion.span
              key={isLiked ? "liked" : "unliked"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {post._count.likes + post.likes.length === 0
                ? isLiked
                  ? +1
                  : 0
                : 0}
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-background hover:text-indigo-500 border border-indigo-700/50 transition-colors duration-200"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {post._count.comments}
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-background hover:text-blue-500 border border-blue-700/50 transition-colors duration-200"
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
