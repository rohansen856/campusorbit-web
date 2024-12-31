"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ShoppingCart, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProductActionsProps {
  onAddToCart: () => void
  onBuyNow?: () => void
  isAvailable: boolean
  quantity: number
  isAddingToCart?: boolean
}

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  disabled: { opacity: 0.7, scale: 1 },
}

const iconVariants = {
  initial: { rotate: 0 },
  hover: { rotate: 10, transition: { duration: 0.2 } },
}

export function ProductActions({
  onAddToCart,
  onBuyNow,
  isAvailable,
  quantity,
  isAddingToCart = false,
}: ProductActionsProps) {
  const getTooltipContent = () => {
    if (!isAvailable) return "Product is currently unavailable"
    if (quantity < 1) return "Please select a quantity"
    if (isAddingToCart) return "Adding to cart..."
    return "Add to your shopping cart"
  }

  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="flex-1"
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={!isAvailable || quantity < 1 ? "disabled" : "initial"}
      >
        <Button
          className="relative w-full overflow-hidden"
          size="lg"
          onClick={onAddToCart}
          disabled={!isAvailable || quantity < 1 || isAddingToCart}
        >
          <AnimatePresence mode="wait">
            {isAddingToCart ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-inherit"
              >
                <motion.div
                  className="size-5 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                className="flex w-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div variants={iconVariants}>
                  <ShoppingCart className="mr-2 size-5" />
                </motion.div>
                Add to Cart
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      <motion.div
        className="flex-1"
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={!isAvailable || quantity < 1 ? "disabled" : "initial"}
      >
        <Button
          className="group w-full"
          size="lg"
          variant="secondary"
          onClick={onBuyNow}
          disabled={!isAvailable || quantity < 1}
        >
          <motion.div variants={iconVariants}>
            <Zap className="mr-2 size-5 transition-colors" />
          </motion.div>
          Buy Now
        </Button>
      </motion.div>
    </motion.div>
  )
}
