"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DialogProps } from "@radix-ui/react-dialog"
import { Book, Calendar, FileText, GraduationCap, Home, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 w-full justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/dashboard"))
              }
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/students"))
              }
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Students</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/teachers"))
              }
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>Teachers</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/classes"))
              }
            >
              <Book className="mr-2 h-4 w-4" />
              <span>Classes</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/subjects"))
              }
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Subjects</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/attendance"))
              }
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Attendance</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/admin/settings"))
              }
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  document.documentElement.classList.toggle("dark")
                })
              }
            >
              <span>Toggle Theme</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}