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
  LogOut
} from "lucide-react"

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", color: "text-sky-500" },
  { label: "Livestock", icon: Beef, href: "/dashboard/livestock", color: "text-orange-700" },
  { label: "Crop Timeline", icon: Sprout, href: "/dashboard/crops/timeline", color: "text-emerald-500" },
  { label: "Market Prices", icon: LineChart, href: "/dashboard/prices", color: "text-blue-600" },
  { label: "Marketplace", icon: Store, href: "/dashboard/marketplace", color: "text-purple-500" },
  { label: "Financials", icon: Wallet, href: "/dashboard/analytics", color: "text-emerald-600" },
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
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="px-3 py-2 border-t border-zinc-800">
         <Link href="/settings" className="text-sm group flex p-3 w-full justify-start font-medium text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition">
            <Settings className="h-5 w-5 mr-3" />
            Settings
         </Link>
         <div className="text-sm group flex p-3 w-full justify-start font-medium text-zinc-400 hover:text-rose-500 cursor-pointer hover:bg-rose-500/10 rounded-lg transition mt-1">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
         </div>
      </div>
    </div>
  )
}