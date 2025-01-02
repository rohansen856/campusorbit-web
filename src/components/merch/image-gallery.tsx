"use client"

import { useState } from "react"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, ZoomIn } from "lucide-react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Image {
  id: number
  imageUrl: string
}

interface ImageGalleryProps {
  images: Image[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const navigate = (direction: "prev" | "next") => {
    setCurrentIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? images.length - 1 : prev - 1
      }
      return (prev + 1) % images.length
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") navigate("prev")
    if (e.key === "ArrowRight") navigate("next")
  }

  return (
    <div
      className="relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product image gallery"
    >
      <AspectRatio ratio={1}>
        <div className="bg-muted relative h-full overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 absolute right-16 top-4 z-10 size-10 rounded-full"
                  >
                    <ZoomIn className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen-lg">
                  <img
                    src="https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" //{images[currentIndex].imageUrl}
                    alt={`${productName} - Full size image ${currentIndex + 1}`}
                    className="size-full object-contain"
                  />
                </DialogContent>
              </Dialog>

              <img
                src="https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" //{images[currentIndex].imageUrl}
                alt={`${productName} - Image ${currentIndex + 1}`}
                className="size-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 size-10 rounded-full"
                onClick={() => navigate("prev")}
              >
                <ChevronLeft className="size-6" />
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 size-10 rounded-full"
                onClick={() => navigate("next")}
              >
                <ChevronRight className="size-6" />
              </Button>
            </motion.div>
          </div>

          {/* Thumbnails */}
          <motion.div
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {images.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  `size-2 rounded-full transition-all`,
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-primary/50 hover:bg-primary/75"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </motion.div>

          {/* Like Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-background/80 absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={cn(
                      `size-5 transition-colors`,
                      isLiked ? "fill-red-500 stroke-red-500" : ""
                    )}
                  />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                {isLiked ? "Remove from wishlist" : "Add to wishlist"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </AspectRatio>

      {/* Thumbnail Strip */}
      <div className="mt-4 flex gap-2 overflow-x-auto p-2">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative aspect-square w-20 shrink-0 overflow-hidden rounded-md",
              index === currentIndex && "ring-primary ring-2"
            )}
            onClick={() => setCurrentIndex(index)}
          >
            <img
              src="https://images.unsplash.com/photo-1696086152504-4843b2106ab4?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" //{image.imageUrl}
              alt={`${productName} thumbnail ${index + 1}`}
              className="size-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
