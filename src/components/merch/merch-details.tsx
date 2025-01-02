"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"

import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

import { ImageGallery } from "./image-gallery"
import { ProductInfo } from "./product-info"

interface MerchDetailsProps {
  id: number
}

export function MerchDetails({ id }: MerchDetailsProps) {
  const [merch, setMerch] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await axios.get(`/api/merch/${id}`)
        setMerch(response.data)
        setSelectedColor(response.data.colors[0].hexCode)
        setSelectedSize(response.data.sizes[0])
      } catch (error) {
        console.error("Failed to fetch merch:", error)
        setError("Failed to load product details")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchMerch()
  }, [id, toast])

  if (loading) {
    return (
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-40 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${merch.name} - ${selectedSize} - Quantity: ${quantity}`,
      duration: 3000,
    })
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="bg-background min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ImageGallery images={merch.images} productName={merch.name} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ProductInfo
                product={merch}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                quantity={quantity}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
