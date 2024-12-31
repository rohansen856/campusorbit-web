"use client"

import { TooltipProvider } from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Palette } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Color {
  id: number
  name: string
  hexCode: string
}

interface ColorPickerProps {
  colors: Color[]
  selectedColor: string
  onChange: (color: string) => void
}

export function ColorPicker({
  colors,
  selectedColor,
  onChange,
}: ColorPickerProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Palette className="size-5" />
          <h3 className="font-semibold">Color Selection</h3>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {colors.map((color, index) => (
            <TooltipProvider key={color.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => onChange(color.hexCode)}
                    className={cn(
                      `ring-secondary flex size-12 items-center justify-center rounded-full ring transition-all`,
                      selectedColor === color.hexCode
                        ? "ring-primary ring-2 ring-offset-2"
                        : "hover:ring-muted hover:ring-2 hover:ring-offset-2"
                    )}
                    style={{ backgroundColor: color.hexCode }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      {selectedColor === color.hexCode && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Check
                            className={cn(
                              `size-6`,
                              isLightColor(color.hexCode)
                                ? "text-black"
                                : "text-white"
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{color.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  )
}

function isLightColor(hexColor: string): boolean {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128
}
