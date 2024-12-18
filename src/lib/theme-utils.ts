import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const courseTypeColors: Readonly<{
    [key: string]: {
        bg: string
        border: string
        text: string
        icon: string
    }
}> = {
    theory: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-700 dark:text-blue-300",
        icon: "text-blue-500",
    },
    lab: {
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        text: "text-green-700 dark:text-green-300",
        icon: "text-green-500",
    },
    tutorial: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-700 dark:text-purple-300",
        icon: "text-purple-500",
    },
} as const
