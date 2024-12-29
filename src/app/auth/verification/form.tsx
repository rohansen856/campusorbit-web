"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { motion } from "framer-motion"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"

import { UploadButton } from "@/lib/uploadthing"
import {
  StudentVerificationFormData,
  studentVerificationSchema,
} from "@/lib/validation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"

export function VerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()

  const form = useForm<StudentVerificationFormData>({
    resolver: zodResolver(studentVerificationSchema),
    defaultValues: {
      collegeEmail: "",
      idCardImage: "",
      portraitImage: "",
      holdingIdImage: "",
    },
  })

  const onSubmit = async (data: StudentVerificationFormData) => {
    setIsSubmitting(true)
    try {
      console.log(data)
      const response = await axios.post("/api/auth/student/verification", data)
      toast({
        title: "Verification Submitted",
        description:
          "Your verification request has been submitted successfully.",
      })
      setIsEmailSent(true)
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description:
          "There was an error submitting your verification. Please try again.",
        variant: "destructive",
      })
      setIsEmailSent(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster />
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>ID Verification</CardTitle>
          <CardDescription>
            Please provide your college email and upload the required images for
            verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="collegeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="collegemail@institute.ac.in"
                        type="email"
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your college email address (.ac.in domain required).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idCardImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Card Image</FormLabel>
                    <FormControl>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res?.[0].url)
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            title: "Error",
                            description: `ERROR! ${error.message}`,
                            variant: "destructive",
                          })
                        }}
                        className="rounded-lg bg-blue-700 pb-2"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a clear image of your ID card (front side).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portraitImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portrait Image</FormLabel>
                    <FormControl>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res?.[0].url)
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            title: "Error",
                            description: `ERROR! ${error.message}`,
                            variant: "destructive",
                          })
                        }}
                        className="rounded-lg bg-blue-700 pb-2"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload a recent full portrait image of yourself.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="holdingIdImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Holding ID</FormLabel>
                    <FormControl>
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res?.[0].url)
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            title: "Error",
                            description: `ERROR! ${error.message}`,
                            variant: "destructive",
                          })
                        }}
                        className="rounded-lg bg-blue-700 pb-2"
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image of yourself holding your ID card.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isEmailSent ? (
                <div className="flex w-full items-center rounded-lg border border-green-500 bg-green-500/30 p-4">
                  <p className="font-bold">
                    Confirmation email has been sent to your mail
                  </p>
                  <Button
                    type="submit"
                    size={"sm"}
                    className="ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader className={`size-4 animate-spin`} />
                    )}
                    Try again
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? "Submitting..." : "Submit Verification"}
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
