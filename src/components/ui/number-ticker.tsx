"use client"

import { useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

export const NumberTicker = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) =>
    Math.round(current).toString()
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span className="tabular-nums">{display}</motion.span>
}
