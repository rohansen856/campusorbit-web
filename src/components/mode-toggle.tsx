"use client"

import * as React from "react"
import { MixerVerticalIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full w-8 h-8 bg-secondary border-primary/20 border-yellow-500 dark:border-indigo-500"
                variant="outline"
                size="icon"
              >
                <SunIcon className="w-5 h-5 rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0 text-yellow-500" />
                <MoonIcon className="absolute w-5 h-5 rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100 text-indigo-500" />
                <span className="sr-only">Switch Theme</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Switch Theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="h-4 w-4 mr-2 dark:text-foreground" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="h-4 w-4 mr-2 dark:text-foreground" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setTheme("system")}
        >
          <MixerVerticalIcon className="h-4 w-4 mr-2 dark:text-foreground" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
