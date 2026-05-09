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
  Zap
} from "lucide-react"

export default function SelectionPage() {
  const [mixedStats, setMixedStats] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Navigation Header - Matches Root Page */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 p-1.5 rounded-lg shadow-lg">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl text-slate-900 dark:text-white">
              SMART<span className="text-amber-500">FARM</span>
            </span>
          </div>
          <div className="h-10 w-10 flex flex-col items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="space-y-1.5">
              <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full"></div>
              <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full"></div>
              <div className="h-0.5 w-6 bg-slate-900 dark:bg-slate-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24 space-y-16">
        
        {/* Welcome Hero Section */}
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <LayoutDashboard className="h-3 w-3" />
            Control Registry
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome to <span className="text-amber-500">SmartFarm</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg">
            Select a specialized module to manage your operations with precision analytics.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* CROP FARMER CARD */}
          <SelectionCard 
            title="Crop Farmer"
            description="Geospatial-first tracking with digital farm maps and predictive yield analytics."
            href="/dashboard/crops"
            icon={<Sprout className="h-6 w-6" />}
            color="emerald"
          />

          {/* LIVESTOCK CARD */}
          <SelectionCard 
            title="Livestock Manager"
            description="Real-time animal health tracking, breeding cycles, and production logs."
            href="/dashboard/livestock"
            icon={<Beef className="h-6 w-6" />}
            color="blue"
          />

          {/* MIXED FARMING CARD */}
          <div className="group relative rounded-[2.5rem] border-2 border-transparent bg-white dark:bg-slate-900 p-8 shadow-xl transition-all duration-300 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-amber-500/10 overflow-hidden">
            
            {/* Live Pulse Indicator */}
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
              {loading ? (
                "Connecting modules..."
              ) : (
                <>
                  Full module integration. Currently tracking 
                  <span className="font-bold text-amber-600 dark:text-amber-400"> {mixedStats} internal transfers </span> 
                  of fodder and organic fertilizer.
                </>
              )}
            </p>

            <Link 
              href="/dashboard/mixed" 
              className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
            >
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
  const colors: any = {
    emerald: "hover:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:shadow-emerald-500/10",
    blue: "hover:border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:shadow-blue-500/10",
  }

  return (
    <div className={`group relative rounded-[2.5rem] border-2 border-transparent bg-white dark:bg-slate-900 p-8 shadow-xl transition-all duration-300 overflow-hidden ${colors[color].split(' ')[0]} ${colors[color].split(' ')[4]}`}>
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${colors[color].split(' ')[1]} ${colors[color].split(' ')[2]} ${colors[color].split(' ')[3]}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed min-h-[60px]">
        {description}
      </p>
      <Link 
        href={href} 
        className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white transition-colors"
      >
        Enter Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
      </Link>
    </div>
  )
}