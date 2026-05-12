"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { 
  ArrowRight, 
  Tractor, 
  Sprout, 
  Beef, 
  Cloud,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  Database
} from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SelectionPage() {
  const [mixedStats, setMixedStats] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    async function getMixedData() {
      try {
        const { count, error } = await supabase
          .from("mixed_farming_logs")
          .select('*', { count: 'exact', head: true })
        
        if (error) throw error
        setMixedStats(count || 0)
      } catch (err) {
        console.error("Error fetching mixed farming stats:", err)
      } finally {
        setLoading(false)
      }
    }
    getMixedData()
  }, [])

  const navLinks = [
    { name: "Global Dashboard", href: "/", icon: LayoutDashboard, color: "text-amber-500" },
    { name: "Crop Farmer", href: "/dashboard/crops", icon: Sprout, color: "text-emerald-500" },
    { name: "Livestock Manager", href: "/dashboard/livestock", icon: Beef, color: "text-blue-500" },
    { name: "Mixed Farming", href: "/dashboard/mixed", icon: Tractor, color: "text-orange-500" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* FUNCTIONAL NAVIGATION HEADER */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg shadow-lg">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl text-slate-900 dark:text-white uppercase">
              Smart<span className="text-amber-500">Farm</span>
            </span>
          </div>

          {/* MOBILE HAMBURGER MENU */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                <Menu className="h-6 w-6 text-slate-900 dark:text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-white dark:bg-slate-950 border-l dark:border-slate-800 p-0">
              <SheetHeader className="p-8 border-b dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 text-left">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <Database className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Command Center</span>
                </div>
                <SheetTitle className="text-2xl font-black tracking-tighter dark:text-white">Navigation</SheetTitle>
              </SheetHeader>

              <nav className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2 rounded-lg bg-slate-100 dark:bg-slate-800", link.color)}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest dark:text-slate-300 group-hover:text-amber-500 transition-colors">
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-0 w-full p-8 border-t dark:border-slate-900">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase">Online</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24 space-y-16">
        {/* Welcome Hero Section */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <LayoutDashboard className="h-3 w-3" />
            Control Registry
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            Welcome to <span className="text-amber-500">SmartFarm</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg font-medium">
            Select a specialized module to manage your operations with precision analytics.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          <SelectionCard 
            title="Crop Farmer"
            description="Geospatial-first tracking with digital farm maps and predictive yield analytics."
            href="/dashboard/crops"
            icon={<Sprout className="h-6 w-6" />}
            color="emerald"
          />

          <SelectionCard 
            title="Livestock Manager"
            description="Real-time animal health tracking, breeding cycles, and production logs."
            href="/dashboard/livestock"
            icon={<Beef className="h-6 w-6" />}
            color="blue"
          />

          {/* MIXED FARMING CARD (Unique layout with stats) */}
          <div className="group relative rounded-[2.5rem] border-2 border-transparent bg-white dark:bg-slate-900 p-8 shadow-xl transition-all duration-300 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-amber-500/10 overflow-hidden">
            {!loading && mixedStats !== null && mixedStats > 0 && (
              <div className="absolute top-6 right-8 flex items-center gap-2 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">Active Synergy</span>
              </div>
            )}
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-110">
              <Tractor className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Mixed Farming</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[60px]">
              {loading ? "Connecting modules..." : (
                <>Full module integration tracking <span className="font-bold text-amber-600 dark:text-amber-400">{mixedStats} internal transfers</span> of fodder and organic fertilizer.</>
              )}
            </p>
            <Link href="/dashboard/mixed" className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-amber-600 transition-colors">
              Enter Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SelectionCard({ title, description, href, icon, color }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorMap: any = {
    emerald: "hover:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    blue: "hover:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  }

  return (
    <div className={cn(
      "group relative rounded-[2.5rem] border-2 border-transparent bg-white dark:bg-slate-900 p-8 shadow-xl transition-all duration-300 overflow-hidden",
      title === "Crop Farmer" ? "hover:border-emerald-500 hover:shadow-emerald-500/10" : "hover:border-blue-500 hover:shadow-blue-500/10"
    )}>
      <div className={cn("mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", colorMap[color])}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[60px]">
        {description}
      </p>
      <Link href={href} className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white transition-colors">
        Enter Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  )
}