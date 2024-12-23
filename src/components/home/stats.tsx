"use client"

import { motion } from "framer-motion"

import { NumberTicker } from "@/components/ui/number-ticker"

export function StatsSection() {
  const stats = [
    { label: "Active Students", value: 50000 },
    { label: "Institutes", value: 75 },
    { label: "Active Clubs", value: 500 },
    { label: "Daily Articles", value: 200 },
  ]

  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <NumberTicker value={stat.value} />+
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
