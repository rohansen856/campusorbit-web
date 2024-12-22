"use client"

import { motion } from "framer-motion"

type FilterButtonProps = {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

export function FilterButton({
  active,
  onClick,
  icon,
  label,
}: FilterButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm
                ${
                  active
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
    >
      {icon}
      {label}
    </motion.button>
  )
}
