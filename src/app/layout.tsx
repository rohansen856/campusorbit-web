import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"

import "./globals.css"

import Image from "next/image"
import { auth } from "@/auth"

import { cn } from "@/lib/utils"
import { MainNav } from "@/components/main-nav"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.AUTH_URL
      ? `${process.env.AUTH_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Campusorbut",
  description: "One stop solution for all your campus needs",
  openGraph: {
    url: "/",
    title: "Campusorbit - built for students",
    description: "One stop solution for all your campus needs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Campusorbit - built for students",
    description: "One stop solution for all your campus needs",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "relative max-w-full overflow-x-hidden",
            inter.className
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <MainNav />
            <main className="z-10">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
