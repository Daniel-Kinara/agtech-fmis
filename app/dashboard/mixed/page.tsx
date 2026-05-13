"use client"

import React, { useState, useEffect } from "react"
import { generateUniversalReport } from "@/lib/report-generator"
import { supabase } from "@/lib/supabase"
import { MixedFarmingOverview } from "@/components/mixed-farming-overview"
import { LogSynergyForm } from "@/components/log-synergy-form"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card"
import { 
  Recycle, 
  Sparkles, 
  Info, 
  ShieldCheck,
  Zap,
  Beef,
  Sprout,
  Loader2
} from "lucide-react"

export default function MixedFarmingPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [inventory, setInventory] = useState({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    crops: [] as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    livestock: [] as any[],
    loading: true
  })

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    fetchInventory()
  }
  const onExport = () => {
  generateUniversalReport({
    title: "Mixed Farming Report",
    livestock: inventory.livestock,
    crops: inventory.crops,
    efficiency: { score: "75%", label: "Self-Sufficient" }
  })
}

  const fetchInventory = async () => {
    setInventory(prev => ({ ...prev, loading: true }))
    
    // FETCH REAL DATA: Targeting specific columns to populate the image_567842.png section
    const [cropsRes, liveRes] = await Promise.all([
      supabase.from("crops").select("id, crop_type, acreage, status"),
      supabase.from("livestock").select("id, category, quantity, health_status")
    ])

    setInventory({
      crops: cropsRes.data || [],
      livestock: liveRes.data || [],
      loading: false
    })
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  return (
    <div className="flex-col flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <Recycle className="h-5 w-5 animate-spin-[spin_8s_linear_infinite]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synergy Dashboard</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Mixed Farming</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Tracking the circular flow of resources across your farm ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <LogSynergyForm onRefresh={handleRefresh} />
          </div>
        </div>

        {/* Global Overview Stats */}
        <div className="w-full">
            <MixedFarmingOverview key={refreshKey} />
        </div>

        {/* Intelligence Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-7">
          <Card className="md:col-span-4 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden relative rounded-[2rem]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-lg font-bold">
                    <Sparkles className="h-5 w-5" /> 
                    System Efficiency
                </CardTitle>
                <Zap className="h-4 w-4 text-emerald-500 opacity-50" />
              </div>
              <CardDescription className="dark:text-slate-400">How well your departments support each other.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your current data suggests that <span className="font-bold text-slate-900 dark:text-white underline decoration-emerald-500/30">Organic Integration</span> is 
                reducing your dependence on external synthetic inputs.
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                 <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Sustainability Goal</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">75% Self-sufficiency reached this quarter.</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden relative rounded-[2rem]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500 text-lg font-bold">
                <Info className="h-5 w-5" /> 
                Resource Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <FlowItem color="bg-emerald-500" label="Fodder" route="Crops → Cows" />
                <FlowItem color="bg-orange-500" label="Manure" route="Cows → Fields" />
                <FlowItem color="bg-blue-500" label="Bedding" route="Crops → Barns" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* REAL-TIME ASSET REGISTRY: THE SECTION FROM image_567842.png */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* LIVESTOCK ASSETS */}
          <Card className="border-none shadow-lg bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                  <Beef className="h-4 w-4 text-orange-500" /> Livestock Inventory
                </CardTitle>
              </div>
              {inventory.loading && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
            </CardHeader>
            <CardContent>
              <div className="space-y-3 min-h-[80px]">
                {!inventory.loading && inventory.livestock.length > 0 ? (
                  inventory.livestock.map((live) => (
                    <InventoryItem 
                      key={live.id} 
                      title={live.category} 
                      value={`${live.quantity} Head`} 
                      status={live.health_status} 
                      color="text-orange-500" 
                    />
                  ))
                ) : !inventory.loading ? (
                  <p className="text-xs text-slate-500 italic p-2">No livestock data found.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* CROP ASSETS */}
          <Card className="border-none shadow-lg bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-emerald-500" /> Active Acreage
                </CardTitle>
              </div>
              {inventory.loading && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
            </CardHeader>
            <CardContent>
              <div className="space-y-3 min-h-[80px]">
                {!inventory.loading && inventory.crops.length > 0 ? (
                  inventory.crops.map((crop) => (
                    <InventoryItem 
                      key={crop.id} 
                      title={crop.crop_type} 
                      value={`${crop.acreage} Acres`} 
                      status={crop.status} 
                      color="text-emerald-500" 
                    />
                  ))
                ) : !inventory.loading ? (
                  <p className="text-xs text-slate-500 italic p-2">No crop data found.</p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function FlowItem({ color, label, route }: { color: string, label: string, route: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
            </div>
            <span className="text-[10px] font-mono font-black text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {route}
            </span>
        </div>
    )
}

function InventoryItem({ title, value, status, color }: { title: string, value: string, status: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{title}</p>
        <p className={`text-[10px] font-bold ${color} uppercase tracking-widest`}>{status}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}