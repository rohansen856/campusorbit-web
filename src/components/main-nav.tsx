"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { useCurrentUser } from "@/hooks/use-current-user"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Logo } from "@/components/logo"
import { ModeToggle } from "@/components/mode-toggle"

import { UserButton } from "./auth/user-button"

const mainNavItems = [
  {
    title: "Features",
    items: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Clubs", href: "/clubs" },
      { title: "Find Users", href: "/users" },
    ],
  },
  {
    title: "Resources",
    items: [
      { title: "Learning Hub", href: "/resources/learning" },
      { title: "Translation Guide", href: "/resources/guide" },
      { title: "API Documentation", href: "/docs/api" },
      { title: "Community Forum", href: "/community" },
    ],
  },
  {
    title: "About",
    items: [
      { title: "About Us", href: "/about" },
      { title: "Contact", href: "/contact" },
      { title: "Careers", href: "/careers" },
      { title: "Blog", href: "/blog" },
    ],
  },
]

export function MainNav() {
  const router = useRouter()
  const user = useCurrentUser()

  return (
    <nav className="glass-morphism sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <div
            className="flex cursor-pointer items-center space-x-4"
            onClick={() => router.push("/")}
          >
            <Logo />
            <span className="gradient-text text-lg font-bold">Campusorbit</span>
          </div>

          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>
              {mainNavItems.map((section) => (
                <NavigationMenuItem key={section.title}>
                  <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {section.items.map((item) => (
                        <li key={item.title}>
                          <NavigationMenuLink asChild>
                            <a
                              href={item.href}
                              className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors"
                            >
                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-8">
          <ModeToggle />
          {user ? (
            <UserButton
              user={{
                name: user.name,
                email: user.email,
                image: user.image,
              }}
            />
          ) : (
            <Link
              href={"/auth/sign-in"}
              className={buttonVariants({ variant: "secondary" })}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
