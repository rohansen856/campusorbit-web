"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { DEFAULT_SIGNIN_REDIRECT } from "@/routes"
import { Loader } from "lucide-react"
import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button"

export function Social() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [loadingGitHub, setLoadingGitHub] = useState(false)

  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_SIGNIN_REDIRECT,
    })
  }

  return (
    <div className="w-full flex flex-col">
      <div className="mt-1 mb-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-200 dark:before:border-gray-400 after:mt-0.5 after:flex-1 after:border-t after:border-gray-200 dark:after:border-gray-400">
        <p className="mx-4 mb-0 text-center font-medium text-muted-foreground">
          or
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-center w-full gap-2">
        <Button
          size="lg"
          className="w-full px-0"
          variant="outline"
          disabled={loadingGoogle}
          onClick={() => {
            setLoadingGoogle(true)
            onClick("google")
          }}
        >
          {loadingGoogle && <Loader className="animate-spin mr-2" size={18} />}
          <FcGoogle className="h-5 w-5 mr-2" />
          <span className="text-xs">Sign in with Google</span>
        </Button>
      </div>
    </div>
  )
}
