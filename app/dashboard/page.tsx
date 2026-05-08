"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Wallet, 
  Package, 
  AlertTriangle, 
  Beef, 
  Sprout, 
  ArrowUpRight 
} from "lucide-react"

export default function SmartFarmDashboard() {
  // Financial Data in Ksh
  const summaryStats = [
    { label: "Total Revenue", value: "Ksh 1,240,000", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Expenses", value: "Ksh 450,200", icon: Wallet, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Pending Orders", value: "24", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Urgent Alerts", value: "3", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">SmartFarm Overview</h1>
        <p className="text-slate-500 font-medium italic">Empowering your farm-to-fork journey.</p>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. Livestock Summary (Left) */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Beef className="text-green-700 h-5 w-5" />
              <CardTitle>Livestock Status</CardTitle>
            </div>
            <CardDescription>Real-time herd health summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-600">Total Cattle</span>
              <span className="font-bold">42 Head</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-600">In Treatment</span>
              <Badge variant="destructive">3 Critical</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Milk Yield (Daily)</span>
              <span className="text-emerald-600 font-bold">185 Liters</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. Crop Performance (Middle/Large) */}
        <Card className="lg:col-span-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sprout className="text-emerald-700 h-5 w-5" />
                <CardTitle>Crop Tracking</CardTitle>
              </div>
              <CardDescription>Seed-to-Sale predictive analytics</CardDescription>
            </div>
            <Badge className="bg-emerald-600">Active Season</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Maize</p>
                <p className="text-lg font-bold text-emerald-700">85% Health</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Potatoes</p>
                <p className="text-lg font-bold text-emerald-700">Mature</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Soil Moists.</p>
                <p className="text-lg font-bold text-blue-600">42%</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm text-center">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Est. Yield</p>
                <p className="text-lg font-bold text-slate-900">12.5 T</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. Strategic Marketplace Insight */}
      <Card className="bg-slate-900 text-white overflow-hidden relative">
        <CardContent className="p-8">
          <div className="max-w-2xl space-y-4 relative z-10">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              Market Discovery <ArrowUpRight className="text-emerald-400" />
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg font-medium">
              Maize prices in <span className="text-white font-bold">Nairobi (Muthurwa Market)</span> have peaked at <span className="text-emerald-400 font-bold">Ksh 5,200</span> per 90kg bag. Selling now through the D2C Marketplace could increase your margin by <span className="underline decoration-emerald-500 underline-offset-4">18%</span> compared to local brokers.
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95">
              List on Marketplace
            </button>
          </div>
          {/* Decorative design element */}
          <div className="absolute top-0 right-0 h-full w-1/3 bg-emerald-600 opacity-10 skew-x-12 translate-x-10" />
        </CardContent>
      </Card>
    </div>
  )
}