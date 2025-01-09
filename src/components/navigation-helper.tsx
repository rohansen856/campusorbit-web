// components/navigation-breadcrumb.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function NavigationHelper() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter((segment) => segment)

  return (
    <Breadcrumb className="container">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const path = `/${segments.slice(0, index + 1).join("/")}`

          const formattedSegment = segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          return (
            <BreadcrumbItem key={path}>
              {isLast ? (
                <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={path}>
                    {formattedSegment}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                </>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
