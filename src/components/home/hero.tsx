"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, ClipboardCheck, GraduationCap, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-16">
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Your Campus Community Hub
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Connecting IITs, IIITs, and NITs students through a unified
              platform for collaboration, knowledge sharing, and campus life
              management.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={"/dashboard"}
                className={cn(
                  buttonVariants({
                    size: "lg",
                    className:
                      "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200",
                  })
                )}
              >
                Join Now
              </Link>
              <Link
                href={"/dashboard"}
                className={cn(
                  buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className:
                      "border-2 hover:bg-gradient-to-r hover:from-blue-600/10 hover:to-purple-600/10",
                  })
                )}
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              <Image
                src="/illustrations/hero.svg"
                alt="Campus Life Illustration"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: GraduationCap, label: "Verified Students", color: "blue" },
            { icon: Users, label: "Active Communities", color: "purple" },
            { icon: Calendar, label: "Event Planning", color: "pink" },
            {
              icon: ClipboardCheck,
              label: "Attendance Tracking",
              color: "indigo",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="relative p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/10 to-transparent rounded-xl -z-10`}
                />
                <div
                  className={`w-12 h-12 rounded-lg bg-${item.color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}
                >
                  <item.icon className={`w-6 h-6 text-${item.color}-500`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
