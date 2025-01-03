import { useState } from "react"
import { motion } from "framer-motion"
import { Book, Coffee, Gift, Laptop, Shirt } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { type MerchFormData } from "@/lib/validation"
import { Badge } from "@/components/ui/badge"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

const categoryOptions = [
  { value: "clothing", label: "Clothing", icon: Shirt },
  { value: "electronics", label: "Electronics", icon: Laptop },
  { value: "books", label: "Books", icon: Book },
  { value: "accessories", label: "Accessories", icon: Gift },
  { value: "others", label: "Others", icon: Coffee },
]

interface BasicInfoStepProps {
  form: UseFormReturn<MerchFormData>
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  const [parsedDescription, setParsedDescription] = useState("")
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)

  async function parseContent(content: string) {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .use(rehypeHighlight)
      .process(content)
    const parsedContent = String(file)
    setParsedDescription(parsedContent)
    setIsPreviewVisible(true)
  }

  const formFieldAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  }

  const previewAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.3 },
  }

  return (
    <div className="space-y-6">
      {/* Name field remains the same */}
      <motion.div {...formFieldAnimation}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="font-semibold">Name</FormLabel>
              <FormControl>
                <Input
                  className="transition-all duration-200"
                  placeholder="Enter merch name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      {/* Description field remains the same */}
      <motion.div {...formFieldAnimation}>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                Description
                <Badge className="bg-secondary text-secondary-foreground ml-2">
                  Markdown
                </Badge>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px] transition-all duration-200"
                  placeholder="Enter merch description (markdown supported)"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    parseContent(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      {parsedDescription && (
        <motion.div
          {...previewAnimation}
          className="bg-secondary rounded-lg border"
        >
          <div className="bg-secondary border-b p-3 pb-0">
            <Label className="text-sm font-semibold">Preview</Label>
          </div>
          <div className="prose prose-sm text-primary max-w-none p-4 pt-0">
            <div dangerouslySetInnerHTML={{ __html: parsedDescription }} />
          </div>
        </motion.div>
      )}

      <motion.div {...formFieldAnimation}>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <Input
                    className="pl-6 transition-all duration-200"
                    type="number"
                    step="1"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div {...formFieldAnimation}>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Category</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                >
                  {categoryOptions.map((option) => (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                      >
                        <option.icon className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </div>
  )
}
