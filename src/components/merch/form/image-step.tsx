import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Image as ImageIcon, Plus, X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { type MerchFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface ImagesStepProps {
  form: UseFormReturn<MerchFormData>
}

export function ImagesStep({ form }: ImagesStepProps) {
  const images = form.watch("images") || []
  const thumbnailImage = form.watch("thumbnailImage") || ""

  const addImage = () => {
    form.setValue("images", [...images, ""])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    form.setValue("images", newImages)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Thumbnail Image Field */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FormField
          control={form.control}
          name="thumbnailImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Thumbnail Image
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter thumbnail image URL"
                  className="transition-all duration-200 hover:ring-2 hover:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {thumbnailImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2"
                >
                  <img
                    src={thumbnailImage}
                    alt="Thumbnail preview"
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                </motion.div>
              )}
            </FormItem>
          )}
        />
      </motion.div>

      <div className="space-y-4">
        <FormLabel className="text-lg font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Additional Images
        </FormLabel>
        <AnimatePresence>
          {images.map((imageUrl, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <FormField
                control={form.control}
                name={`images.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm">
                      Image {index + 1}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          placeholder="Enter image URL"
                          className="transition-all duration-200 hover:ring-2 hover:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(index)}
                          className="transition-transform duration-200"
                        >
                          <X className="size-4" />
                        </Button>
                      </motion.div>
                    </div>
                    <FormMessage />
                    {field.value && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-2"
                      >
                        <img
                          src={field.value}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-lg shadow-sm"
                        />
                      </motion.div>
                    )}
                  </FormItem>
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="button"
          variant="outline"
          onClick={addImage}
          className="w-full group transition-all duration-300"
        >
          <Plus className="mr-2 size-4 group-hover:rotate-180 transition-transform duration-300" />
          Add Image
        </Button>
      </motion.div>
    </motion.div>
  )
}
