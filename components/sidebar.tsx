"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Beef, 
  Sprout, 
  Store, 
  LineChart, 
  Wallet,
  Settings,
  LogOut,
  History,
  ArrowRightLeft,
  Cloud
} from "lucide-react"
import { ModeToggle } from './mode-toggle'

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-400" },
  { label: "Livestock", icon: Beef, href: "/dashboard/livestock", color: "text-orange-400" },
  { label: "Crops", icon: Sprout, href: "/dashboard/crops", color: "text-emerald-400" },
  { label: "Crop Timeline", icon: History, href: "/dashboard/crops/timeline", color: "text-emerald-300" },
  { label: "Market Prices", icon: LineChart, href: "/dashboard/prices", color: "text-blue-400" },
  { label: "Marketplace", icon: Store, href: "/dashboard/marketplace", color: "text-purple-400" },
  { label: "Financials", icon: Wallet, href: "/dashboard/analytics", color: "text-emerald-500" },
  { label: "Mixed Farming", icon: ArrowRightLeft, href: "/dashboard/mixed", color: "text-amber-500" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white border-r border-slate-800 transition-colors duration-300">
      
      {/* 1. Header & Scrollable Nav Area */}
      <div className="px-6 py-6 flex-1 overflow-y-auto scrollbar-hide">
        <Link href="/selection" className="flex items-center gap-2 mb-8 group">
          <div className="bg-amber-500 p-1.5 rounded-lg shadow-lg group-hover:rotate-3 transition-transform">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase">
            Smart<span className="text-amber-500">Farm</span>
          </span>
        </Link>
        
        <nav className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-[11px] group flex p-3 w-full justify-start font-black uppercase tracking-widest cursor-pointer rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-white bg-white/10 shadow-sm border-l-4 border-amber-500 rounded-l-none" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-5 w-5 mr-3 transition-colors", route.color)} />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
      
      {/* 2. Fixed Bottom Section (Appearance & Logout) */}
      <div className="mt-auto px-4 pb-6 space-y-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800">
        <div className="space-y-1 pt-4">
          <Link 
            href="/dashboard/settings" 
            className="text-[11px] group flex p-3 w-full justify-start font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
          
          <div className="text-[11px] group flex p-3 w-full justify-start font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 cursor-pointer hover:bg-rose-500/10 rounded-xl transition">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </div>
        </div>

        {/* High-Visibility Appearance Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Appearance</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-tighter font-bold italic">Smart Toggle</span>
          </div>
          <div className="scale-110">
             <ModeToggle />
          </div>
        </div>
      </div>

    </div>
  )
}