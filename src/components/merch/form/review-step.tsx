import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type MerchFormData } from "@/lib/validation"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface ReviewStepProps {
  form: UseFormReturn<MerchFormData>
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function ReviewStep({ form }: ReviewStepProps) {
  const values = form.getValues()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <motion.h3
          variants={fadeInUp}
          className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-xl font-semibold text-transparent"
        >
          Review Your Merch
        </motion.h3>
        <Separator />

        <motion.div variants={staggerChildren} className="grid gap-6">
          <motion.div variants={fadeInUp} className="space-y-3">
            <h4 className="text-primary/90 text-lg font-medium">
              Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-3 rounded-lg p-4 text-sm">
              <dt className="text-muted-foreground font-medium">Name:</dt>
              <dd className="font-semibold">
                {values.name || (
                  <span className="text-primary/50 italic">No name</span>
                )}
              </dd>
              <dt className="text-muted-foreground font-medium">Price:</dt>
              <dd className="font-semibold">₹{values.price}</dd>
              <dt className="text-muted-foreground font-medium">Category:</dt>
              <dd className="font-semibold">{values.category}</dd>
            </div>
          </motion.div>

          <Separator />

          <motion.div variants={fadeInUp} className="space-y-3">
            <h4 className="text-primary/90 text-lg font-medium">Description</h4>
            <p className="rounded-lg p-4 text-sm leading-relaxed">
              {values.description || (
                <span className="text-primary/50 italic">
                  No description provided
                </span>
              )}
            </p>
          </motion.div>

          <Separator />

          <motion.div variants={fadeInUp} className="space-y-3">
            <h4 className="text-primary/90 text-lg font-medium">Variants</h4>
            <div className="grid grid-cols-2 gap-3 rounded-lg p-4 text-sm">
              <dt className="text-muted-foreground font-medium">Sizes:</dt>
              <dd className="font-semibold">
                {values.sizes.length === 0 && (
                  <span className="text-primary/50 italic">No sizes added</span>
                )}
                {values.sizes.join(", ")}
              </dd>
              <dt className="text-muted-foreground font-medium">Colors:</dt>
              <dd className="font-semibold">
                {values.colors.length === 0 && (
                  <span className="text-primary/50 italic">
                    No colors added
                  </span>
                )}
                {values.colors.map((c) => (
                  <span className={cn(`mr-1`, `text-[${c.hexCode}]`)}>
                    {c.name}
                  </span>
                ))}
              </dd>
              <dt className="text-muted-foreground font-medium">
                Initial Stock:
              </dt>
              <dd className="font-semibold">{values.stock} units</dd>
            </div>
          </motion.div>

          <Separator />

          <motion.div variants={fadeInUp} className="space-y-3">
            <h4 className="text-primary/90 text-lg font-medium">Images</h4>
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence>
                {values.images.length === 0 && (
                  <span className="text-primary/50 text-sm italic">
                    No images uploaded
                  </span>
                )}
                {values.images.map((url, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-lg shadow-md"
                  >
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="aspect-square object-cover transition-transform hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        <Separator />

        <motion.div variants={fadeInUp}>
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg p-4 transition-colors">
                <FormLabel className="cursor-pointer text-base font-medium">
                  Feature this merch?
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
