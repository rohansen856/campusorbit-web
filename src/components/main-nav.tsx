"use client"

import { useRouter } from "next/navigation"

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
import { useCurrentUser } from "@/hooks/use-current-user"
import Link from "next/link"

const mainNavItems = [
    {
        title: "Features",
        items: [
            { title: "Text Translation", href: "/translate" },
            { title: "Document Translation", href: "/translate/file" },
            { title: "Batch Translation", href: "/translate/multi" },
            { title: "Language Alphabets", href: "/alphabets" },
            { title: "Language Country Map", href: "/language-maps" },
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
        title: "Company",
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
                        <span className="gradient-text text-lg font-bold">
                            Translate Hub
                        </span>
                    </div>

                    <NavigationMenu className="hidden md:block">
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
                            href={"/auth/login"}
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
