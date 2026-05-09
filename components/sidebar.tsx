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
  ArrowRightLeft
} from "lucide-react"
import { ModeToggle } from './mode-toggle'

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
  { label: "Livestock", icon: Beef, href: "/dashboard/livestock", color: "text-orange-700" },
  { label: "Crops", icon: Sprout, href: "/dashboard/crops", color: "text-emerald-500" },
  { label: "Crop Timeline", icon: History, href: "/dashboard/crops/timeline", color: "text-emerald-400" },
  { label: "Market Prices", icon: LineChart, href: "/dashboard/prices", color: "text-blue-600" },
  { label: "Marketplace", icon: Store, href: "/dashboard/marketplace", color: "text-purple-500" },
  { label: "Financials", icon: Wallet, href: "/dashboard/analytics", color: "text-emerald-600" },
  { label: "Mixed Farming", icon: ArrowRightLeft,href: "/dashboard/mixed",color: "text-amber-500" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
            <Sprout className="text-emerald-500 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter">
            SmartFarm<span className="text-emerald-500">.</span>
          </h1>
        </Link>
        
        <nav className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-white bg-white/10 shadow-sm" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
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
      
      {/* Bottom Actions */}
      <div className="px-3 pt-2 border-t border-zinc-800">
        <Link 
          href="/dashboard/settings" 
          className="text-sm group flex p-3 w-full justify-start font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </Link>
        
        <div className="text-sm group flex p-3 w-full justify-start font-medium text-zinc-400 hover:text-rose-500 cursor-pointer hover:bg-rose-500/10 rounded-lg transition mt-1">
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </div>

        {/* Appearance Toggle Section */}
        <div className="mt-4 px-3 py-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-200">Appearance</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-tighter font-bold">Theme Settings</span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}