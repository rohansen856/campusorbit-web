"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Ruler } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Size {
  id: number
  size: string
  chest: string // Added for size guide
}

interface SizePickerProps {
  sizes: Size[]
  selectedSize: string
  onChange: (size: string) => void
}

export function SizePicker({ sizes, selectedSize, onChange }: SizePickerProps) {
  return (
    <div className="space-y-4">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-semibold">Size</h3>
        <HoverCard openDelay={200} closeDelay={150}>
          <HoverCardTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors"
              aria-label="View size guide"
            >
              <Ruler className="size-4" />
              Size Guide
            </motion.button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80" asChild>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <h4 className="font-semibold">Size Guide</h4>
                <p className="text-muted-foreground text-sm">
                  Measure around your chest at the fullest point. Keep the tape
                  horizontal and taut but not tight.
                </p>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Size
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium">
                          Chest (cm)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map((size) => (
                        <tr key={size.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{size.size}</td>
                          <td className="px-4 py-2 text-sm">{size.chest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </HoverCardContent>
        </HoverCard>
      </motion.div>

      <RadioGroup
        value={selectedSize}
        onValueChange={onChange}
        className="mt-2"
      >
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {sizes.map((size) => (
              <motion.div
                key={size.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RadioGroupItem
                  value={size.size}
                  id={`size-${size.size}`}
                  className="peer sr-only"
                  aria-label={`Select size ${size.size}`}
                />
                <Label
                  htmlFor={`size-${size.size}`}
                  className="border-input bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-secondary peer-data-[state=checked]:text-primary hover:border-primary/50 flex size-12 cursor-pointer items-center justify-center rounded-full border font-medium transition-all duration-200"
                >
                  {size.size}
                </Label>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </RadioGroup>
    </div>
  )
}
