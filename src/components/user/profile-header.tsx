"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Calendar,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  User,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function ProfileHeader({ user }: { user: any }) {
  return (
    <div className="relative mb-8">
      <div className="h-80 w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          src={
            user.background_banner ||
            "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
          }
          alt="Profile Banner"
          className="w-full h-full rounded-xl object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <Avatar className="w-40 h-40 border-4 border-background shadow-xl">
                <AvatarImage src={user.profile_image || user.user.image} />
                <AvatarFallback>
                  <User className="w-20 h-20" />
                </AvatarFallback>
              </Avatar>
              {user.verified && (
                <Badge className="absolute bottom-2 right-2 bg-blue-500">
                  ✓
                </Badge>
              )}
            </motion.div>

            <div className="flex-1 text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight"
              >
                {user.user.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-neutral-200"
              >
                @{user.username}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2"
            >
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button size="lg" variant="outline" className="border-2">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button size="icon" variant="ghost">
                <Share2 className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
