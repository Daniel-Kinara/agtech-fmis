"use client"

import React, { useState } from "react"
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
  ArrowRightLeft,
  ShieldCheck,
  Zap
} from "lucide-react"

export default function MixedFarmingPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

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

        {/* Global Overview Stats & Recent Activity */}
        <div className="w-full">
            <MixedFarmingOverview key={refreshKey} />
        </div>

        {/* Intelligence Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-7">
          
          {/* Sustainability Insights */}
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
                reducing your dependence on external synthetic inputs. By recycling manure, you are improving 
                the <span className="text-emerald-600 dark:text-emerald-400 font-bold">Cation Exchange Capacity (CEC)</span> of your soil 
                while providing high-protein fodder for your livestock.
              </p>
              
              <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 group hover:scale-[1.01] transition-transform">
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

          {/* Resource Legend - Transformed into a "Flow Card" */}
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
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                  <ArrowRightLeft className="h-3 w-3" />
                  <span>Updates in real-time as logs are submitted</span>
                </div>
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