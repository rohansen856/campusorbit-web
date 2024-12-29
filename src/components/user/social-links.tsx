"use client"

import { motion } from "framer-motion"
import {
  Github,
  Instagram,
  Linkedin,
  MessageSquare,
  Twitter,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const socialIcons = {
  github: {
    icon: Github,
    color: "border-neutral-800/50 hover:bg-neutral-800",
  },
  linkedin: { icon: Linkedin, color: "border-blue-600/50 hover:bg-blue-600" },
  twitter: { icon: Twitter, color: "border-sky-500/50 hover:bg-sky-500" },
  instagram: {
    icon: Instagram,
    color: "border-pink-600/50 hover:bg-pink-600",
  },
  discord: {
    icon: MessageSquare,
    color: "border-indigo-600/50 hover:bg-indigo-600",
  },
}

export function SocialLinks({ socials }: { socials: any }) {
  if (!socials) return null

  return (
    <Card className="border-neutral-200/10 bg-white/10 p-6 backdrop-blur-sm dark:bg-black/10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap justify-around gap-4"
      >
        {Object.entries(socialIcons).map(
          ([key, { icon: Icon, color }], index) => {
            if (!socials[key]) return null

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={socials[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className={`transition-colors duration-300 ${color}`}
                  >
                    <Icon className="mr-2 size-5" />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Button>
                </a>
              </motion.div>
            )
          }
        )}
      </motion.div>
    </Card>
  )
}
