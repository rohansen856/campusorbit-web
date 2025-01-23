"use client"

import { useEffect, useState } from "react"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"

interface BreakpointConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  "2xl": number
  "3xl": number
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
}

export const useBreakpoint = (
  customBreakpoints?: Partial<BreakpointConfig>
): Breakpoint => {
  const breakpoints: BreakpointConfig = {
    ...defaultBreakpoints,
    ...customBreakpoints,
  }

  const getBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints["2xl"]) return "2xl"
    if (width >= breakpoints.xl) return "xl"
    if (width >= breakpoints.lg) return "lg"
    if (width >= breakpoints.md) return "md"
    if (width >= breakpoints.sm) return "sm"
    return "xs"
  }

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    getBreakpoint(typeof window !== "undefined" ? window.innerWidth : 0)
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = (): void => {
      setBreakpoint(getBreakpoint(window.innerWidth))
    }

    window.addEventListener("resize", handleResize)

    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return breakpoint
}
