"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Beef, Recycle, Loader2, ArrowRightLeft } from "lucide-react"

export function MixedFarmingOverview() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState({ fodder: 0, manure: 0, logs: [] as any[] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data: logs } = await supabase.from("mixed_farming_logs").select("*").order("log_date", { ascending: false })
      const fodder = logs?.filter(l => l.type === 'Fodder').reduce((acc, curr) => acc + curr.quantity, 0) || 0
      const manure = logs?.filter(l => l.type === 'Manure').reduce((acc, curr) => acc + curr.quantity, 0) || 0
      setStats({ fodder, manure, logs: logs?.slice(0, 5) || [] })
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-amber-500 h-8 w-8" /></div>

  return (
    <div className="space-y-4">
      {/* Responsive Grid: Stacks on mobile, 3 cols on desktop */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-emerald-50/40 border-emerald-100 shadow-none">
          <CardHeader className="pb-1 pt-4 px-4 flex-row justify-between items-center space-y-0">
            <CardTitle className="text-[11px] font-bold text-emerald-800 uppercase tracking-tighter">Crop Supply</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold text-emerald-950">{stats.fodder} Units</div>
            <p className="text-[10px] text-emerald-600 font-medium uppercase mt-0.5 tracking-tight">Total Fodder Outflow</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50/40 border-orange-100 shadow-none">
          <CardHeader className="pb-1 pt-4 px-4 flex-row justify-between items-center space-y-0">
            <CardTitle className="text-[11px] font-bold text-orange-800 uppercase tracking-tighter">Livestock Supply</CardTitle>
            <Beef className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold text-orange-950">{stats.manure} Units</div>
            <p className="text-[10px] text-orange-600 font-medium uppercase mt-0.5 tracking-tight">Total Manure Inflow</p>
          </CardContent>
        </Card>
      </div>

      {/* Feed Card: Scrollable for mobile */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Recycle className="h-4 w-4 text-amber-500" /> Resource Flow Feed
        </h4>
        <div className="space-y-2 overflow-x-auto">
          {stats.logs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl min-w-[280px] border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${log.type === 'Fodder' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{log.type}</p>
                  <p className="text-[10px] text-slate-400">{log.log_date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-900">+{log.quantity} {log.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}