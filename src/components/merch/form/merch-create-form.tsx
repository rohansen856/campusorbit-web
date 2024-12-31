"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { merchSchema, type MerchFormData } from "@/lib/validation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { BasicInfoStep } from "./basic-info-step"
import { ImagesStep } from "./image-step"
import { ReviewStep } from "./review-step"
import { VariantsStep } from "./variants-step"

const steps = [
  { id: "basic-info", title: "Basic Information" },
  { id: "images", title: "Images" },
  { id: "variants", title: "Variants" },
  { id: "review", title: "Review" },
]

export function MerchCreationForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<MerchFormData>({
    resolver: zodResolver(merchSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      sizes: [],
      colors: [],
      images: [],
      stock: 0,
      featured: false,
    },
  })

  const onSubmit = async (data: MerchFormData) => {
    try {
      setIsSubmitting(true)
      const response = await fetch("/api/merch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create merch")

      toast({
        title: "Success",
        description: "Merch created successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create merch. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex size-8 items-center justify-center rounded-full ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-sm">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && <BasicInfoStep form={form} />}
              {currentStep === 1 && <ImagesStep form={form} />}
              {currentStep === 2 && <VariantsStep form={form} />}
              {currentStep === 3 && <ReviewStep form={form} />}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0 || isSubmitting}
            >
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create Merch
              </Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
