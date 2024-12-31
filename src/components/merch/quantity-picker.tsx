"use client"

import { TooltipProvider } from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "framer-motion"
import { Minus, Package2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface QuantityPickerProps {
  quantity: number
  onChange: (quantity: number) => void
  max: number
}

export function QuantityPicker({
  quantity,
  onChange,
  max,
}: QuantityPickerProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package2 className="size-5" />
            <h3 className="font-semibold">Quantity</h3>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="sm">
                Stock: {max}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm">Maximum quantity available for purchase</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Decrease quantity</TooltipContent>
            </Tooltip>

            <AnimatePresence mode="wait">
              <motion.span
                key={quantity}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-12 text-center text-lg font-medium"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onChange(Math.min(max, quantity + 1))}
                    disabled={quantity >= max}
                  >
                    <Plus className="size-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Increase quantity</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </CardContent>
    </Card>
  )
}
