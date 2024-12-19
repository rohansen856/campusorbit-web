"use client"

import Image from "next/image"
import { Club } from "@prisma/client"
import { motion } from "framer-motion"
import { Building2, Calendar, Sparkles, Trophy, Users } from "lucide-react"

import { clubTypeColors, clubTypeIcons } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface ClubCardProps {
  club: Club & { _count: { members: number } }
  index: number
}

export function ClubCard({ club, index }: ClubCardProps) {
  const Icon = clubTypeIcons[club.clubType] || Trophy
  const colorScheme =
    clubTypeColors[club.clubType] ||
    "from-blue-500/20 to-cyan-500/20 border-blue-200/20"
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "relative border rounded-xl bg-secondary/50 flex flex-col md:flex-row overflow-hidden"
      )}
    >
      <div className="relative flex items-start gap-4 p-6">
        <motion.div
          className="relative w-24 h-24 rounded-lg overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <Image
            src={/*club.icon ||*/ "/TPC.jpeg"}
            alt={club.name}
            fill
            className="w-full h-full object-contain"
          />
        </motion.div>

        <div className="flex-1 md:border-l-2 md: pl-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{club.name}</h2>
            <div className="p-2 rounded-full bg-white/10">
              <Icon className="w-4 h-4" />
            </div>
          </div>

          <p className="text-secondary-foreground mb-4 line-clamp-2">
            {club.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Badge>
              <Users size={14} className="mr-1" />
              120 Members
            </Badge>
            <Badge>
              <Trophy size={14} className="mr-1" />
              {club.clubType}
            </Badge>
            <Badge>
              <Calendar size={14} className="mr-1" />
              {new Date(club.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>

      <div className="ml-auto flex gap-2">
        <div className="py-2">
          <Avatar className="h-10 w-10 bg-secondary border border-primary/30">
            <AvatarImage
              src={"/iiitdmj.jpg"}
              className="object-contain"
              alt={""}
            />
            <AvatarFallback>
              <Building2 />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="w-16 bg-yellow-600/70 h-full"></div>
      </div>
    </motion.div>
  )
}
