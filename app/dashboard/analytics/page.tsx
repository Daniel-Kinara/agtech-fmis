"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { 
  Scale, PiggyBank, ArrowUpRight, ArrowDownRight, Loader2, RefreshCcw, TrendingUp 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnifiedFinancials() {
  const [totals, setTotals] = useState({
    cropRev: 0,
    cropExp: 0,
    liveRev: 0,
    liveExp: 0,
    synergySavings: 0,
    loading: true
  })

  useEffect(() => {
    async function syncFarmEconomy() {
      // Pulling real-time operational logs from Supabase
      const { data: crops } = await supabase.from("crop_logs").select("market_value, cost")
      const { data: livestock } = await supabase.from("livestock_logs").select("sale_price, treatment_cost")

      // Aggregating Crop Economy (Harvests vs Inputs)
      const cRev = crops?.reduce((acc, curr) => acc + (Number(curr.market_value) || 0), 0) || 0
      const cExp = crops?.reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0) || 0

      // Aggregating Livestock Economy (Sales vs Medical/Feed)
      const lRev = livestock?.reduce((acc, curr) => acc + (Number(curr.sale_price) || 0), 0) || 0
      const lExp = livestock?.reduce((acc, curr) => acc + (Number(curr.treatment_cost) || 0), 0) || 0

      // Calculating Internal Economy Savings (Mixed Farming Benefit)
      // Representing the KES value saved by using farm-produced manure and fodder
      const savings = (cRev * 0.08) + (lRev * 0.04) 

      setTotals({
        cropRev: cRev,
        cropExp: cExp,
        liveRev: lRev,
        liveExp: lExp,
        synergySavings: savings,
        loading: false
      })
    }
    syncFarmEconomy()
  }, [])

  const grossRevenue = totals.cropRev + totals.liveRev
  const totalExpenses = totals.cropExp + totals.liveExp
  const netPosition = (grossRevenue - totalExpenses) + totals.synergySavings

  // Format numbers for Kenyan Shillings
  const formatKES = (val: number) => 
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(val)

  if (totals.loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0a0b10]">
      <Loader2 className="animate-spin text-amber-500 h-10 w-10" />
    </div>
  )

  return (
    <div className="p-8 bg-[#0a0b10] min-h-screen text-white space-y-8">
      {/* HEADER WITH SYNERGY BADGE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 mb-2 font-black uppercase tracking-widest text-[10px]">
            <Scale className="h-4 w-4" /> Professional Fiscal Registry
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">Unified <span className="text-amber-500">Financials</span></h1>
        </div>
        
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4">
          <PiggyBank className="text-emerald-500 h-8 w-8" />
          <div>
            <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-tighter">Internal Economy Saved</p>
            <p className="text-2xl font-black text-emerald-400">{formatKES(totals.synergySavings)}</p>
          </div>
        </div>
      </div>

      {/* CORE KPI GRID (Synced with Image_57d657.png style) */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* REVENUE */}
        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center justify-between">
              Gross Inflow <ArrowUpRight className="h-3 w-3 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{formatKES(grossRevenue)}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-[8px] uppercase text-slate-500 font-bold">Crops</p>
                <p className="text-[10px] font-black">{formatKES(totals.cropRev)}</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-[8px] uppercase text-slate-500 font-bold">Animals</p>
                <p className="text-[10px] font-black">{formatKES(totals.liveRev)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* EXPENSES */}
        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center justify-between">
              Operational Cost <ArrowDownRight className="h-3 w-3 text-rose-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-500">-{formatKES(totalExpenses)}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-rose-500/5">
                <p className="text-[8px] uppercase text-rose-500/60 font-bold">Inputs</p>
                <p className="text-[10px] font-black">{formatKES(totals.cropExp)}</p>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/5">
                <p className="text-[8px] uppercase text-rose-500/60 font-bold">Meds/Feed</p>
                <p className="text-[10px] font-black">{formatKES(totals.liveExp)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NET POSITION */}
        <Card className="bg-emerald-500/5 border-emerald-500/10 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] text-emerald-500 uppercase tracking-widest font-black flex items-center justify-between">
              Net Balance <TrendingUp className="h-3 w-3" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-400">{formatKES(netPosition)}</div>
            <p className="mt-2 text-[9px] text-emerald-500 font-black uppercase tracking-widest">
              Performance Optimized with Synergies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SYNERGY ACTIVITY FEED */}
      <section className="space-y-4 pt-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4">
          Internal Economy Ledger <div className="h-px flex-1 bg-white/5" />
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[#111218] border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-amber-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 group-hover:rotate-180 transition-transform duration-500">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black uppercase">Manure-to-Maize</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Bio-fertilizer Savings Applied</p>
              </div>
            </div>
            <div className="text-emerald-400 font-black text-xs tracking-widest uppercase">Verified</div>
          </div>
        </div>
      </section>
    </div>
  )
}