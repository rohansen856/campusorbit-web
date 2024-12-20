"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Socials } from "@prisma/client"
import axios from "axios"
import { Loader } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { SocialsFormData, socialsSchema } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface SocialMediaFormProps {
  socials: Socials | null
}

export default function SocialMediaForm({ socials }: SocialMediaFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFormEdited, setIsFormEdited] = useState(false)

  const form = useForm<SocialsFormData>({
    resolver: zodResolver(socialsSchema),
    defaultValues: {
      github: socials?.github || "",
      linkedin: socials?.linkedin || "",
      twitter: socials?.twitter || "",
      instagram: socials?.instagram || "",
      discord: socials?.discord || "",
    },
  })

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        const isChanged = Object.keys(value).some(
          (key) =>
            value[key as keyof SocialsFormData] !==
            socials?.[key as keyof SocialsFormData]
        )
        setIsFormEdited(isChanged)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, socials])

  const onSubmit = async (data: SocialsFormData) => {
    setIsLoading(true)
    try {
      const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
        acc[key as keyof SocialsFormData] = formatSocialUrl(key, value)
        return acc
      }, {} as SocialsFormData)
      console.log(formattedData)

      const res = await axios.put(`/api/auth/student`, formattedData)
      if (res.status === 202) toast.success("Updated Successfully!")
      setIsFormEdited(false)
    } catch (error) {
      toast.error("Error updating socials!")
    } finally {
      setIsLoading(false)
    }
  }

  const formatSocialUrl = (platform: string, value: string | null) => {
    const urlPrefixes = {
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
      twitter: "https://twitter.com/",
      instagram: "https://instagram.com/",
      discord: "https://discord.com/users/",
    }

    if (!value) return null
    if (value.startsWith("http://") || value.startsWith("https://"))
      return value
    return `${urlPrefixes[platform as keyof typeof urlPrefixes]}${value}`
  }

  const socialIcons = {
    github: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
    linkedin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
    twitter: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
      </svg>
    ),
    instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
    discord: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 18l-3-3v-3a9 9 0 1 0-18 0v3l-3 3"></path>
        <path d="M10 18v.5a2.5 2.5 0 0 0 5 0V18"></path>
      </svg>
    ),
  }

  const socialColors = {
    github: "text-gray-800 dark:text-gray-200",
    linkedin: "text-blue-600 dark:text-blue-400",
    twitter: "text-sky-500 dark:text-sky-400",
    instagram: "text-pink-600 dark:text-pink-400",
    discord: "text-indigo-600 dark:text-indigo-400",
  }

  return (
    <Card className="w-full max-w-[500px]">
      <CardHeader>
        <CardTitle>Edit Social Media Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {Object.keys(socialIcons).map((platform) => (
              <FormField
                key={platform}
                control={form.control}
                name={platform as keyof SocialsFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span
                        className={
                          socialColors[platform as keyof typeof socialColors]
                        }
                      >
                        {socialIcons[platform as keyof typeof socialIcons]}
                      </span>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder={`Enter your ${platform} ${platform === "discord" ? "username" : "username or full profile URL"}`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormEdited}
            >
              {isLoading ? (
                <Loader className="size-6 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
