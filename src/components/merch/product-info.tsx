"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Info, Share2, ShoppingCart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ColorPicker } from "./color-picker"
import { ProductActions } from "./product-actions"
import { QuantityPicker } from "./quantity-picker"
import { SizePicker } from "./size-picker"

interface ProductInfoProps {
  product: any
  selectedColor: string
  selectedSize: string
  quantity: number
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onAddToCart,
}: ProductInfoProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <motion.div variants={itemVariants}>
              <div className="mb-2 flex items-center gap-2">
                <CardTitle className="text-3xl">{product.name}</CardTitle>
                <AnimatePresence mode="wait">
                  {product.isAvailable ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="default" className="bg-green-500">
                        In Stock
                      </Badge>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="destructive">Out of Stock</Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <CardDescription className="text-primary text-2xl font-semibold">
                ₹{product.price.toFixed(2)}
              </CardDescription>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share product</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Product Details</SheetTitle>
                    <SheetDescription>
                      Complete information about the product
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <p className="leading-relaxed">{product.description}</p>
                  </div>
                </SheetContent>
              </Sheet>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator />

          <motion.div variants={itemVariants}>
            <ColorPicker
              colors={product.colors}
              selectedColor={selectedColor}
              onChange={onColorChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SizePicker
              sizes={product.sizes}
              selectedSize={selectedSize}
              onChange={onSizeChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuantityPicker
              quantity={quantity}
              onChange={onQuantityChange}
              max={product.remainingQuanity}
            />
          </motion.div>

          <Separator />

          <motion.div variants={itemVariants}>
            <ProductActions
              onAddToCart={onAddToCart}
              isAvailable={product.isAvailable}
              quantity={quantity}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
