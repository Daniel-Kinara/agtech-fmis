"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { 
  ArrowRight, 
  Tractor, 
  Sprout, 
  Beef, 
  Recycle,
  Sparkles 
} from "lucide-react"

export default function SelectionPage() {
  const [mixedStats, setMixedStats] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getMixedData() {
      try {
        // Fetch the count of internal resource transfers from the mixed_farming_logs table
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
    <div className="min-h-screen bg-slate-50 p-8 md:p-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome to SmartFarm</h1>
          <p className="text-slate-500">Select a module to manage your operations.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          
          {/* CROP FARMER CARD (Existing) */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sprout className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Crop Farmer</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Geospatial-first tracking with digital farm maps and predictive yield analytics.
            </p>
            <Link 
              href="/dashboard/crops" 
              className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors"
            >
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* LIVESTOCK CARD (Existing) */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Beef className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Livestock Manager</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Real-time animal health tracking, breeding cycles, and production logs.
            </p>
            <Link 
              href="/dashboard/livestock" 
              className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
            >
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* MIXED FARMING CARD (UPDATED) */}
          <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-200 hover:shadow-md">
            {/* Live Pulse Indicator */}
            {!loading && mixedStats !== null && mixedStats > 0 && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">Active Synergy</span>
              </div>
            )}

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Tractor className="h-6 w-6" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900">Mixed Farming</h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {loading ? (
                "Connecting modules and unified financial dashboards..."
              ) : (
                <>
                  Full module integration. Currently tracking 
                  <span className="font-bold text-amber-600"> {mixedStats} transfers </span> 
                  of fodder and organic fertilizer.
                </>
              )}
            </p>

            <Link 
              href="/dashboard/mixed" 
              className="mt-6 flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors"
            >
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}