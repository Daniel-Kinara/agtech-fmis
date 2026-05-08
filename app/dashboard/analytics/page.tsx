"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  CalendarDays, 
  ChevronRight,
  ArrowUpRight
} from "lucide-react"

export default function AnalyticsPage() {
  const predictions = [
    {
      crop: "Maize (White)",
      estHarvest: "Aug 2026",
      expectedYield: "120 Bags",
      projectedRevenue: 624000,
      confidence: "High",
      status: "On Track"
    },
    {
      crop: "Potatoes (Shangi)",
      estHarvest: "July 2026",
      expectedYield: "85 Bags",
      projectedRevenue: 272000,
      confidence: "Medium",
      status: "Water Stress"
    }
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Harvest Forecast</h1>
        <p className="text-slate-500 font-medium italic">Data-driven projections for your upcoming seasons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Portfolio Forecast */}
        <Card className="lg:col-span-2 bg-slate-900 text-white overflow-hidden relative">
          <CardHeader>
            <CardTitle className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              Total Projected Q3 Revenue
            </CardTitle>
            <div className="text-5xl font-black text-white mt-2">
              Ksh 896,000
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-slate-400 font-bold uppercase">Growth vs Last Season</p>
                <div className="text-emerald-400 font-bold text-xl flex items-center gap-1">
                  <TrendingUp size={18} /> +14.2%
                </div>
              </div>
              <div className="flex-1 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-slate-400 font-bold uppercase">Market Volatility</p>
                <div className="text-amber-400 font-bold text-xl flex items-center gap-1">
                  Low
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-slate-300 leading-relaxed">
                Based on current <span className="text-white font-bold text-emerald-400 underline underline-offset-4">NDVI Satellite data</span>, 
                your maize health is optimal. We recommend securing logistics for the first week of August to capitalize on the 
                Mombasa price peak.
              </p>
            </div>
          </CardContent>
          {/* Decorative Graph Element */}
          <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
            <BarChart3 size={200} className="translate-x-10 translate-y-10" />
          </div>
        </Card>

        {/* Efficiency Score Card */}
        <Card className="border-emerald-200">
          <CardHeader className="text-center">
            <div className="mx-auto bg-emerald-100 text-emerald-700 p-4 rounded-full w-fit mb-2">
              <Target size={32} />
            </div>
            <CardTitle>Farm Efficiency</CardTitle>
            <CardDescription>Yield per Acre vs National Avg</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-black text-slate-900">82%</div>
            <p className="text-sm text-slate-500 font-medium">
              You are performing <span className="text-emerald-600 font-bold">+18%</span> better than local regional benchmarks.
            </p>
            <button className="w-full text-xs font-bold uppercase tracking-tighter text-emerald-700 hover:underline flex items-center justify-center gap-1">
              View Input Optimization Report <ChevronRight size={14} />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Individual Crop Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((p) => (
          <Card key={p.crop} className="hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">{p.crop}</CardTitle>
              <Badge className={
                p.status === "On Track" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
              }>
                {p.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border-y py-4 border-slate-50">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Exp. Harvest</p>
                  <p className="font-bold flex items-center gap-1"><CalendarDays size={14} className="text-slate-400" /> {p.estHarvest}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Exp. Yield</p>
                  <p className="font-bold">{p.expectedYield}</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Projected Net Revenue</p>
                  <p className="text-2xl font-black text-slate-900">Ksh {p.projectedRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg text-white">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}