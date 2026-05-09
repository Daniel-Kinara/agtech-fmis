"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { 
  ArrowRight, 
  Tractor, 
  Sprout, 
  Beef, 
  ChevronRight, 
  Activity,
  Waves
} from "lucide-react"

export default function SelectionPage() {
  const [stats, setStats] = useState({ crops: 0, livestock: 0, mixed: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPortalStats() {
      try {
        const [cropsRes, livestockRes, mixedRes] = await Promise.all([
          supabase.from("fields").select("*", { count: "exact", head: true }),
          supabase.from("livestock").select("*", { count: "exact", head: true }),
          supabase.from("mixed_farming_logs").select("*", { count: "exact", head: true })
        ])

        setStats({
          crops: cropsRes.count || 0,
          livestock: livestockRes.count || 0,
          mixed: mixedRes.count || 0
        })
      } catch (err) {
        console.error("Portal fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchPortalStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start py-12 px-4 sm:px-6 md:p-10">
      <div className="w-full max-w-6xl space-y-10">
        
        {/* NEW: Welcome & Header Section */}
        <div className="text-center md:text-left space-y-4 px-2 max-w-2xl">
          <div className="flex items-center justify-center md:justify-start gap-2 text-amber-600 font-bold text-[10px] uppercase tracking-[0.2em]">
            <Waves className="h-4 w-4 animate-pulse" />
            Live Ecosystem
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Welcome to <span className="text-amber-600">SmartFarm</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Your unified agricultural command center. Manage fields, track livestock health, and optimize your circular economy from one responsive dashboard.
            </p>
          </div>
          
          <div className="h-1 w-20 bg-amber-200 rounded-full mx-auto md:mx-0" />
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <ModuleCard 
            title="Crop Farmer"
            description="Geospatial field mapping and harvest cycle tracking."
            href="/dashboard/crops"
            icon={<Sprout className="h-6 w-6" />}
            color="emerald"
            count={stats.crops}
            countLabel="Active Fields"
            loading={loading}
          />

          <ModuleCard 
            title="Livestock Manager"
            description="Animal health monitoring, breeding, and production logs."
            href="/dashboard/livestock"
            icon={<Beef className="h-6 w-6" />}
            color="blue"
            count={stats.livestock}
            countLabel="Animal Groups"
            loading={loading}
          />

          <ModuleCard 
            title="Mixed Farming"
            description="Resource loop management between crops and livestock."
            href="/dashboard/mixed"
            icon={<Tractor className="h-6 w-6" />}
            color="amber"
            count={stats.mixed}
            countLabel="Synergy Logs"
            loading={loading}
            isSynergy
          />

        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ModuleCard({ title, description, href, icon, color, count, countLabel, loading, isSynergy }: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-400",
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-400",
    amber: "bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-400"
  }

  return (
    <Link href={href} className="group block">
      <div className={`h-full relative bg-white p-6 rounded-[2rem] border-2 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 ${colorMap[color]}`}>
        
        {isSynergy && count > 0 && (
          <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-amber-200 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Active</span>
          </div>
        )}

        <div>
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${colorMap[color]}`}>
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-snug">
            {description}
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.1em]">{countLabel}</span>
            <span className="text-xl font-black text-slate-900">
              {loading ? "..." : count}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </Link>
  )
}