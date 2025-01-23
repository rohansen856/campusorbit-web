"use client"

import { useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Send,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StudentInfo {
  group: string
  semester: number
  branch: string
  institute_id: number
}

interface ChatBotProps {
  studentInfo: StudentInfo
}

interface Message {
  role: "user" | "assistant"
  content: string
  status?: "success" | "error" | "warning"
}

const chatVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

const messageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
}

export function ChatBot({ studentInfo }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokens, setTokens] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await axios.post("/api/query", {
        query: input,
        student: studentInfo,
      })

      const data = response.data
      setTokens(data.tokens)

      if (data.status === "success") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response, status: "success" },
        ])
      } else if (data.status === "warning") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message, status: "warning" },
        ])
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again."
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage, status: "error" },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const getMessageIcon = (status?: string) => {
    switch (status) {
      case "error":
        return <AlertTriangle className="text-destructive size-4" />
      case "warning":
        return <AlertTriangle className="size-4 text-yellow-500" />
      case "success":
        return <CheckCircle2 className="size-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 size-14 rounded-full p-0 shadow-lg md:bottom-8 md:right-8"
      >
        <MessageSquare className="size-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-background fixed bottom-20 right-4 z-50 w-[95vw] max-w-[400px] rounded-lg border shadow-lg md:bottom-24 md:right-8"
          >
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Bot className="size-6" />
                </motion.div>
                <h2 className="text-lg font-semibold">Class Assistant</h2>
                {tokens !== null && (
                  <Badge variant="secondary" className="ml-2">
                    {tokens?.toString()} tokens
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-destructive/10"
              >
                <X className="size-4" />
              </Button>
            </div>

            <ScrollArea className="h-[60vh] max-h-[500px] p-4">
              <div className="space-y-4">
                {messages.map((message, i) => (
                  <motion.div
                    key={i}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="pt-0.5">
                        {getMessageIcon(message.status)}
                      </span>
                      <span>{message.content}</span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground flex items-center space-x-2 text-sm"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Loader2 className="size-4" />
                    </motion.div>
                    <span>Processing your request...</span>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about your classes..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="hover:bg-primary/90 transition-all duration-200"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
