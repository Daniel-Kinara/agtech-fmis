"use client"

import React from "react"
import Link from "next/link"
import { Cloud, Menu, X } from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-amber-500 p-1.5 rounded-lg shadow-lg group-hover:rotate-3 transition-transform">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl text-slate-900 dark:text-white">
            SMART<span className="text-amber-500">FARM</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="/dashboard/crops">Crops</NavLink>
          <NavLink href="/dashboard/livestock">Livestock</NavLink>
          <NavLink href="/dashboard/mixed">Mixed Farming</NavLink>
        </div>

        {/* Mobile Menu & Theme-Aware Hamburger */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              >
                {/* Custom Hamburger Lines for perfect theme visibility */}
                <div className="space-y-1.5">
                  <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full transition-colors group-hover:w-4"></div>
                  <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full transition-colors"></div>
                  <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full transition-colors group-hover:w-5"></div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
              <DropdownMenuItem asChild className="rounded-xl focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:text-amber-600 dark:focus:text-amber-400">
                <Link href="/dashboard/crops" className="w-full font-bold text-xs uppercase tracking-widest py-3">Crop Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:text-amber-600 dark:focus:text-amber-400">
                <Link href="/dashboard/livestock" className="w-full font-bold text-xs uppercase tracking-widest py-3">Livestock Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:text-amber-600 dark:focus:text-amber-400">
                <Link href="/dashboard/mixed" className="w-full font-bold text-xs uppercase tracking-widest py-3">Mixed Farming</Link>
              </DropdownMenuItem>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
              <DropdownMenuItem asChild className="rounded-xl">
                <Link href="/" className="w-full font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 py-2">Switch Module</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
    >
      {children}
    </Link>
  )
}