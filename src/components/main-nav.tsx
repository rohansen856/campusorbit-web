"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  Book,
  Building2,
  ChevronDown,
  Code,
  Flag,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LucideIcon,
  Mail,
  MessageSquare,
  MessagesSquare,
  Shield,
  Users,
} from "lucide-react"

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
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Clubs", href: "/clubs", icon: Users },
      { title: "Find Users", href: "/users", icon: Users },
      { title: "View Posts", href: "/posts", icon: MessageSquare },
    ],
  },
  {
    title: "Resources",
    icon: Book,
    items: [
      {
        title: "Learning Hub",
        href: "/resources/learning",
        icon: GraduationCap,
      },
      { title: "Translation Guide", href: "/resources/guide", icon: Book },
      { title: "API Documentation", href: "/docs/api", icon: Code },
      { title: "Community Forum", href: "/community", icon: MessagesSquare },
      { title: "Help Center", href: "/help", icon: HelpCircle },
    ],
  },
  {
    title: "About",
    icon: Building2,
    items: [
      { title: "About Us", href: "/about", icon: Building2 },
      { title: "Contact", href: "/contact", icon: Mail },
      { title: "Privacy Policy", href: "/privacy", icon: Shield },
      { title: "Terms of Service", href: "/terms", icon: Flag },
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
interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

interface NavSection {
  title: string
  icon: LucideIcon
  items: NavItem[]
}

interface SidebarProps {
  isOpen: boolean
  navItems: NavSection[]
  className?: string
}

interface ExpandedSections {
  [key: string]: boolean
}

// Animation variants
const sidebarVariants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
}

const contentVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  navItems,
  className = "",
}) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({})

  const toggleSection = (title: string): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sidebarVariants}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className={`fixed left-0 top-16 h-screen w-72 bg-background border-r shadow-lg z-40 ${className}`}
        >
          <div className="flex flex-col p-4 h-full overflow-y-auto">
            {navItems.map((section) => (
              <motion.div
                key={section.title}
                initial={false}
                className="mb-4 rounded-lg overflow-hidden bg-background hover:bg-accent/5 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full p-3 text-sm font-medium text-foreground hover:text-primary"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="w-4 h-4" />
                    <span>{section.title}</span>
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedSections[section.title] ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedSections[section.title] && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={contentVariants}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-1">
                        {section.items.map((item) => (
                          <Link
                            href={item.href}
                            key={item.title}
                            className="block"
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent/10 transition-colors duration-200"
                            >
                              <item.icon className="w-4 h-4" />
                              {item.title}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Sidebar

export function MainNav() {
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
            <Link
              href={"/"}
              className="flex cursor-pointer items-center space-x-2 md:space-x-4"
            >
              <Logo />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
                Campusorbit
              </span>
            </Link>
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
                                  <div className="text-primary/30">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Facilis, iusto.
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
            <div className="flex items-center space-x-2 md:space-x-4 xl:space-x-8 m-auto absolute right-0">
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
      <Sidebar isOpen={isOpen} navItems={mainNavItems} />
    </>
  )
}
