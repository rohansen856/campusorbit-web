"use client"

import { Club } from "@prisma/client"
import { motion } from "framer-motion"

import { CLUB_TYPES } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

interface ClubCardProps {
  club: Club
  index: number
}

export function ClubCard({ club, index }: ClubCardProps) {
  const clubType = CLUB_TYPES.find((type) => type.value === club.clubType)
  const cardDelay = index * 0.1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: cardDelay }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-75 transition-opacity group-hover:opacity-100",
              clubType?.color
            )}
          />
          <img
            src={club.banner}
            alt={club.name}
            className="w-full h-32 object-cover"
          />
          <div className="absolute -bottom-8 left-4">
            <Avatar className="w-16 h-16 border-4 border-background">
              <AvatarImage src={club.icon} alt={club.name} />
              <AvatarFallback>{club.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="p-4 pt-10">
          <h3 className="text-lg font-semibold mb-1">{club.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {club.description?.slice(0, 100)}...
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {clubType?.icon} {clubType?.label}
            </span>
            <span className="text-sm text-muted-foreground">
              {/* {club.members.length} members */}0 members
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
