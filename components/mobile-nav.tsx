"use client"

import React, { useState, useEffect } from 'react'
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, // Add this
  SheetHeader  // Add this
} from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

export function MobileNav() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <div className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
          <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full transition-all group-hover:w-4" />
          <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full transition-all" />
          <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full transition-all group-hover:w-5" />
        </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#111827] border-none w-72">
        {/* Fix for DialogTitle Error */}
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}