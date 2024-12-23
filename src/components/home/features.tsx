"use client"

import { motion } from "framer-motion"
import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  MessageSquare,
  Users,
  Video,
} from "lucide-react"

const gradients = [
  "from-blue-500 to-purple-500",
  "from-purple-500 to-pink-500",
  "from-pink-500 to-red-500",
  "from-red-500 to-orange-500",
  "from-orange-500 to-yellow-500",
  "from-yellow-500 to-green-500",
  "from-green-500 to-teal-500",
  "from-teal-500 to-blue-500",
]

export function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Articles & Resources",
      description:
        "Access and share academic resources, study materials, and experiences",
    },
    {
      icon: Calendar,
      title: "Schedule Manager",
      description:
        "Organize your academic calendar and never miss important events",
    },
    {
      icon: Users,
      title: "Club Activities",
      description:
        "Discover and participate in various club activities across institutes",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get timely updates about classes, events, and deadlines",
    },
    {
      icon: Award,
      title: "Institute Updates",
      description:
        "Stay informed about latest news and achievements from all institutes",
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description:
        "Engage in meaningful discussions with peers across institutes",
    },
    {
      icon: Video,
      title: "Video Content",
      description: "Watch and share educational videos and campus experiences",
    },
    {
      icon: ClipboardList,
      title: "Attendance Tracking",
      description: "Monitor and manage your attendance across all courses",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container px-4 mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed specifically for IIT, IIIT, and
            NIT students to enhance their academic journey and campus life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradients[index]} p-0.5`}
                >
                  <div className="w-full h-full rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${gradients[index]}" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
