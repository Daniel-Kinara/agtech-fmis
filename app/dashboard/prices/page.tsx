"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, ArrowRight, TrendingUp, TrendingDown, Info, Calculator } from "lucide-react"

// Define the data structure for type safety
type MarketData = {
  crop: string;
  nairobi: number;
  mombasa: number;
  eldoret: number;
  trend: 'up' | 'down' | 'stable';
}

const priceData: MarketData[] = [
  { crop: "Maize (90kg)", nairobi: 5200, mombasa: 5400, eldoret: 4800, trend: "up" },
  { crop: "Beans Rosecoco (90kg)", nairobi: 12500, mombasa: 13000, eldoret: 11800, trend: "down" },
  { crop: "Potatoes (50kg)", nairobi: 3200, mombasa: 3800, eldoret: 2500, trend: "stable" },
  { crop: "Onions (1kg)", nairobi: 120, mombasa: 150, eldoret: 100, trend: "up" },
]

export default function MarketPriceTracker() {
  const [selectedCrop, setSelectedCrop] = useState<MarketData>(priceData[0])

  return (
    <div className="space-y-6 pb-10">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="text-blue-600" /> Market Price Tracker
          </h1>
          <p className="text-slate-500 font-medium font-sans">Real-time commodity prices across regional hubs.</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3">
          Last Updated: Today
        </Badge>
      </div>

      {/* Strategic Insight Card */}
      <Card className="bg-blue-600 text-white border-none shadow-lg">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xl font-bold flex items-center gap-2 uppercase tracking-wide">
              <Calculator className="text-blue-200" /> Regional Arbitrage
            </div>
            <div className="text-blue-100 max-w-xl text-lg">
              Selling <span className="font-bold text-white">{selectedCrop.crop}</span> in Mombasa instead of Eldoret could earn you an extra 
              <span className="font-bold text-white underline mx-1">Ksh {(selectedCrop.mombasa - selectedCrop.eldoret).toLocaleString()}</span> 
              per unit.
            </div>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12 shadow-md">
            Calculate Logistics
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Price Table */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Regional Price List</CardTitle>
            <CardDescription>Prices updated from major distribution centers.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-t">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Commodity</TableHead>
                  <TableHead className="font-bold">Nairobi</TableHead>
                  <TableHead className="font-bold">Mombasa</TableHead>
                  <TableHead className="font-bold">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceData.map((item) => (
                  <TableRow 
                    key={item.crop} 
                    className={`cursor-pointer transition-colors ${selectedCrop.crop === item.crop ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                    onClick={() => setSelectedCrop(item)}
                  >
                    <TableCell className="font-bold text-slate-900">{item.crop}</TableCell>
                    <TableCell>Ksh {item.nairobi.toLocaleString()}</TableCell>
                    <TableCell>Ksh {item.mombasa.toLocaleString()}</TableCell>
                    <TableCell>
                      {item.trend === "up" && <TrendingUp className="text-emerald-500 h-5 w-5" />}
                      {item.trend === "down" && <TrendingDown className="text-rose-500 h-5 w-5" />}
                      {item.trend === "stable" && <Info className="text-slate-400 h-5 w-5" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* FIXED Sell Direct Card (No more Hydration Errors) */}
        <Card className="border-emerald-200 bg-emerald-50/30 flex flex-col shadow-sm">
          <CardHeader>
            <CardTitle className="text-emerald-900">Marketplace Direct</CardTitle>
            <CardDescription>Estimated direct-to-consumer profit.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-emerald-100 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1 tracking-wider">Suggested Retail Price</div>
                <div className="text-3xl font-black text-emerald-700">Ksh {(selectedCrop.nairobi + 300).toLocaleString()}</div>
                <div className="text-xs text-emerald-600 font-semibold mt-1 italic">+ Ksh 300 SmartFarm Premium</div>
              </div>
              
              {/* ✅ FIXED: Using <div> and <span> to avoid Hydration Errors */}
              <div className="space-y-3 pt-2">
                <div className="text-sm font-medium text-slate-700 flex items-center gap-3">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full shrink-0" />
                  <span>Digital traceability active</span>
                </div>
                <div className="text-sm font-medium text-slate-700 flex items-center gap-3">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full shrink-0" />
                  <span>Verified Grade A listing</span>
                </div>
                <div className="text-sm font-medium text-slate-700 flex items-center gap-3">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full shrink-0" />
                  <span>Zero brokerage fees</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold shadow-lg transition-transform active:scale-95">
              List on Marketplace <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}