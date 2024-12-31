import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, X } from "lucide-react"
import { UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type MerchFormData } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface VariantsStepProps {
  form: UseFormReturn<MerchFormData>
}

const availableSizes = ["XS", "S", "M", "L", "XL", "2XL"]

export function VariantsStep({ form }: VariantsStepProps) {
  const colors = form.watch("colors") || []

  const addColor = () => {
    form.setValue("colors", [...colors, { name: "", hexCode: "" }])
  }

  const removeColor = (index: number) => {
    const newColors = colors.filter((_, i) => i !== index)
    form.setValue("colors", newColors)
  }

  function isValidHexCode(color: string) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    return hexRegex.test(color)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <FormField
        control={form.control}
        name="sizes"
        render={() => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">
              Available Sizes
            </FormLabel>
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {availableSizes.map((size, idx) => (
                <motion.div
                  key={size}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="sizes"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 rounded-lg p-2 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(size)}
                            onCheckedChange={(checked) => {
                              const current = field.value || []
                              const updated = checked
                                ? [...current, size]
                                : current.filter((s) => s !== size)
                              field.onChange(updated)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-sm font-normal">
                          {size}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </motion.div>
              ))}
            </motion.div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel className="text-lg font-semibold">Colors</FormLabel>
        <AnimatePresence>
          {colors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <FormField
                control={form.control}
                name={`colors.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Color name"
                        className="transition-colors hover:border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`colors.${index}.hexCode`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            placeholder="Color hex code"
                            className="transition-colors hover:border-gray-400"
                            {...field}
                          />
                        </FormControl>
                        {isValidHexCode(colors[index].hexCode) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="size-8 rounded-md border"
                            style={{ backgroundColor: colors[index].hexCode }}
                          />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeColor(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            onClick={addColor}
            className="group w-full transition-all duration-300"
          >
            <Plus className="mr-2 size-4 transition-transform duration-300 group-hover:rotate-180" />
            Add Color
          </Button>
        </motion.div>
      </div>

      <FormField
        control={form.control}
        name="stock"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">
              Initial Stock
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter initial stock"
                className="transition-colors hover:border-gray-400"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  )
}
