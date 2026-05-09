"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowRightLeft, 
  Leaf, 
  Beef, 
  Recycle, 
  TrendingUp, 
  Droplets,
  Loader2
} from "lucide-react"

interface SynergyStats {
  fodderCount: number
  manureCount: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs: any[]
}

export function MixedFarmingOverview() {
  const [stats, setStats] = useState<SynergyStats>({
    fodderCount: 0,
    manureCount: 0,
    logs: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSynergyData() {
      try {
        setLoading(true)
        
        // Fetch logs from our synergy table
        const { data: logs, error } = await supabase
          .from("mixed_farming_logs")
          .select("*")
          .order("log_date", { ascending: false })
          .limit(5)

        if (error) throw error

        // Calculate totals (Mocking logic for display - replace with real SUM queries)
        const fodder = logs?.filter(l => l.type === 'Fodder').reduce((acc, curr) => acc + curr.quantity, 0) || 0
        const manure = logs?.filter(l => l.type === 'Manure').reduce((acc, curr) => acc + curr.quantity, 0) || 0

        setStats({
          fodderCount: fodder,
          manureCount: manure,
          logs: logs || []
        })
      } catch (err) {
        console.error("Error fetching synergy data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSynergyData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Stats: The Circular Economy Flow */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Resource Transfer: Fodder to Livestock */}
        <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Crop-to-Livestock</CardTitle>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{stats.fodderCount} Bales</div>
            <p className="text-[10px] text-emerald-600 font-medium uppercase mt-1">Fodder & Silage produced</p>
          </CardContent>
        </Card>

        {/* Resource Transfer: Manure to Fields */}
        <Card className="bg-orange-50/50 border-orange-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-orange-800 uppercase tracking-wider">Livestock-to-Crop</CardTitle>
            <Beef className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.manureCount} Tons</div>
            <p className="text-[10px] text-orange-600 font-medium uppercase mt-1">Organic Fertilizer applied</p>
          </CardContent>
        </Card>

        {/* Efficiency Metric */}
        <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-blue-800 uppercase tracking-wider">Input Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">KES 45,000</div>
            <p className="text-[10px] text-blue-600 font-medium uppercase mt-1">Estimated monthly savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Internal Activity Feed */}
      <div className="p-5 border rounded-2xl bg-white shadow-sm border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
            <Recycle className="h-5 w-5 text-amber-500" /> 
            Recent Resource Transfers
          </h4>
          <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold">LIVE FEED</span>
        </div>

        <div className="space-y-4">
          {stats.logs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm italic border border-dashed rounded-xl">
              No synergy logs found. Start by recording a resource transfer.
            </div>
          ) : (
            stats.logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${log.type === 'Fodder' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {log.type === 'Fodder' ? 'Crops → Livestock' : 'Livestock → Fields'}
                    </p>
                    <p className="text-[10px] text-slate-500">{new Date(log.log_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-black ${log.type === 'Fodder' ? 'text-emerald-600' : 'text-orange-600'}`}>
                    +{log.quantity} {log.unit}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{log.notes || 'Routine Transfer'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}