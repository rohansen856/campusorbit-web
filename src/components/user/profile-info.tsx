"use client"

import { motion } from "framer-motion"
import { Award, BookOpen, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function ProfileInfo({ user }: { user: any }) {
  return (
    <div className="space-y-8 py-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item}>
          <Card className="p-6 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-neutral-200/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Institute
                </p>
                <p className="font-semibold text-nowrap text-clip">
                  {user.institute.short_name}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-neutral-200/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Branch
                </p>
                <p className="font-semibold">{user.branch}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6 backdrop-blur-sm bg-white/10 dark:bg-black/10 border-neutral-200/10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Semester
                </p>
                <p className="font-semibold">{user.semester}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <Separator className="bg-neutral-200/10" />
    </div>
  )
}
