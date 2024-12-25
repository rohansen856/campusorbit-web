"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

import { useCurrentUser } from "@/hooks/use-current-user"
import { buttonVariants } from "@/components/ui/button"
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
      { title: "View Posts", href: "/posts" },
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

const HamburgerButton = ({ isOpen, toggle }: any) => (
  <button
    onClick={toggle}
    className="relative h-10 w-10 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <div className="relative h-full w-full">
      <span
        className={`absolute left-0 top-1 block h-0.5 w-full transform bg-current transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-2" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-3 block h-0.5 w-full transform bg-current transition-all duration-300 ${
          isOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-5 block h-0.5 w-full transform bg-current transition-all duration-300 ${
          isOpen ? "-rotate-45 -translate-y-2" : ""
        }`}
      />
    </div>
  </button>
)

const Sidebar = ({ isOpen, navItems, router }: any) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed left-0 top-16 h-screen w-64 bg-background border-r shadow-lg z-40"
      >
        <div className="flex flex-col p-4">
          {navItems.map((section: any) => (
            <div key={section.title} className="mb-6">
              <h3 className="mb-2 px-4 text-sm font-semibold text-muted-foreground border-b">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item: any) => (
                  <button
                    key={item.title}
                    onClick={() => router.push(item.href)}
                    className="w-full rounded-lg px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-left"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

export function MainNav() {
  const router = useRouter()
  const user = useCurrentUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="relative flex items-center space-x-8 w-full">
            <div
              className="flex cursor-pointer items-center space-x-4"
              onClick={() => router.push("/")}
            >
              <Logo />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                Campusorbit
              </span>
            </div>
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList>
                  {mainNavItems.map((section) => (
                    <NavigationMenuItem key={section.title}>
                      <NavigationMenuTrigger>
                        {section.title}
                      </NavigationMenuTrigger>
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
            )}
            <div className="flex items-center space-x-8 m-auto absolute right-0">
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
                  href="/auth/sign-in"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
              )}
              {isMobile && (
                <HamburgerButton
                  isOpen={isOpen}
                  toggle={() => setIsOpen(!isOpen)}
                />
              )}
            </div>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={isOpen} navItems={mainNavItems} router={router} />
    </>
  )
}
