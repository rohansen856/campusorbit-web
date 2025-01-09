"use client"

import { useRouter } from "next/navigation"
import axios from "axios"

import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { MyPostsList } from "@/components/posts/my-posts-list"
import { ScrollToTopButton } from "@/components/scroll-to-top"

export default function MyPostsPage() {
  const { toast } = useToast()

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`/api/posts/${postId}`)

      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (postId: string, content: string) => {
    try {
      await axios.patch(`/api/posts/${postId}`, { content })

      toast({
        title: "Success",
        description: "Post updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative min-h-screen">
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="mb-6 text-2xl font-bold">Your Posts</h1>
        <MyPostsList onDelete={handleDelete} onUpdate={handleUpdate} />
      </div>
      <ScrollToTopButton />
      <Toaster />
    </div>
  )
}
