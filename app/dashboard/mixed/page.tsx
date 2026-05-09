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
  ShieldCheck
} from "lucide-react"

export default function MixedFarmingPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  // This function forces the Overview component to re-fetch data from Supabase
  // whenever a new transfer is logged in the form.
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="flex-col flex min-h-screen bg-slate-50/30">
      <div className="flex-1 space-y-6 p-8 pt-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600">
              <Recycle className="h-5 w-5 animate-spin-[spin_8s_linear_infinite]" />
              <span className="text-xs font-bold uppercase tracking-widest">Synergy Dashboard</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mixed Farming</h2>
            <p className="text-sm text-muted-foreground">
              Tracking the circular flow of resources across your farm ecosystem.
            </p>
          </div>
          
          {/* Synergy Form Trigger */}
          <div className="flex items-center gap-3">
             <LogSynergyForm onRefresh={handleRefresh} />
          </div>
        </div>

        {/* Global Overview Stats & Recent Activity */}
        {/* The 'key' prop ensures the component re-mounts/re-fetches when data changes */}
        <MixedFarmingOverview key={refreshKey} />

        {/* Intelligence Grid */}
        <div className="grid gap-4 md:grid-cols-7">
          
          {/* Sustainability Insights */}
          <Card className="md:col-span-4 border-none shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700 text-lg">
                <Sparkles className="h-5 w-5" /> 
                System Efficiency
              </CardTitle>
              <CardDescription>How well your departments support each other.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Your current data suggests that <span className="font-bold text-slate-900">Organic Integration</span> is 
                reducing your dependence on external synthetic inputs. By recycling manure, you are improving 
                the <span className="text-emerald-600 font-semibold">Cation Exchange Capacity (CEC)</span> of your soil 
                while providing high-protein fodder for your livestock.
              </p>
              <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                 <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0" />
                 <div>
                    <p className="text-xs font-bold text-emerald-800 uppercase">Sustainability Goal</p>
                    <p className="text-[11px] text-emerald-700">75% Self-sufficiency reached this quarter.</p>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats / Legend */}
          <Card className="md:col-span-3 border-none shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 text-lg">
                <Info className="h-5 w-5" /> 
                Resource Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">Fodder (Silage/Hay)</span>
                  </div>
                  <span className="font-mono font-bold">Crops → Cows</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span className="text-slate-600">Manure (Fertilizer)</span>
                  </div>
                  <span className="font-mono font-bold">Cows → Fields</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-slate-600">Bedding (Straw)</span>
                  </div>
                  <span className="font-mono font-bold">Crops → Barns</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ArrowRightLeft className="h-3 w-3" />
                  <span>Updates in real-time as logs are submitted.</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}