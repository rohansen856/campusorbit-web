"use client"

import { motion } from "framer-motion"

export function Logo() {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#gradient)"
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M12 20L28 20M20 12L20 28"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
      />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="hsl(var(--primary))" />
          <stop offset="0.5" stopColor="hsl(var(--secondary))" />
          <stop offset="1" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
