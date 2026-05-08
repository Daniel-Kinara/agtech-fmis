"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Globe, ArrowRight, TrendingUp, TrendingDown, Info } from "lucide-react"

// Mock Data for Kenyan Markets
const priceData = [
  { crop: "Maize (90kg)", nairobi: 5200, mombasa: 5400, eldoret: 4800, trend: "up" },
  { crop: "Beans Rosecoco (90kg)", nairobi: 12500, mombasa: 13000, eldoret: 11800, trend: "down" },
  { crop: "Potatoes (50kg)", nairobi: 3200, mombasa: 3800, eldoret: 2500, trend: "stable" },
  { crop: "Onions (1kg)", nairobi: 120, mombasa: 150, eldoret: 100, trend: "up" },
]

export default function MarketPriceTracker() {
  const [selectedCrop, setSelectedCrop] = useState(priceData[0])

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="text-blue-600" /> Market Price Tracker
          </h1>
          <p className="text-slate-500 font-medium">Real-time commodity prices across regional hubs.</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 py-1 px-3">
          Last Updated: Today, 10:00 AM
        </Badge>
      </div>

      {/* Strategic Insight Card */}
      <Card className="bg-blue-600 text-white border-none shadow-xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-blue-200" /> Strategic Opportunity
            </h2>
            <p className="text-blue-100 max-w-xl">
              Prices for <span className="font-bold text-white">{selectedCrop.crop}</span> in Mombasa are currently 
              <span className="font-bold text-white italic"> Ksh {(selectedCrop.mombasa - selectedCrop.eldoret).toLocaleString()} </span> 
              higher than Eldoret. Consider logistics costs before listing.
            </p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12">
            View Logistics Map
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Comparison Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Regional Comparison</CardTitle>
            <CardDescription>Prices listed in Kenya Shillings (Ksh)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Nairobi</TableHead>
                  <TableHead>Mombasa</TableHead>
                  <TableHead>Eldoret</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceData.map((item) => (
                  <TableRow 
                    key={item.crop} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedCrop(item)}
                  >
                    <TableCell className="font-bold">{item.crop}</TableCell>
                    <TableCell>Ksh {item.nairobi.toLocaleString()}</TableCell>
                    <TableCell>Ksh {item.mombasa.toLocaleString()}</TableCell>
                    <TableCell>Ksh {item.eldoret.toLocaleString()}</TableCell>
                    <TableCell>
                      {item.trend === "up" && <TrendingUp className="text-emerald-500 h-4 w-4" />}
                      {item.trend === "down" && <TrendingDown className="text-rose-500 h-4 w-4" />}
                      {item.trend === "stable" && <Info className="text-slate-400 h-4 w-4" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Seamless Transition to Marketplace */}
        <Card className="border-emerald-200 bg-emerald-50/50 flex flex-col">
          <CardHeader>
            <CardTitle className="text-emerald-900">Sell Direct</CardTitle>
            <CardDescription>Skip the middleman and list now.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-emerald-100">
                <p className="text-xs font-bold text-slate-500 uppercase">Suggested D2C Price</p>
                <p className="text-3xl font-black text-emerald-700">Ksh {selectedCrop.nairobi + 200}</p>
                <p className="text-xs text-emerald-600 font-medium">+ Ksh 200 premium for farm-fresh</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full" /> Traceability active
                </p>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full" /> Verified Farmer badge
                </p>
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold">
              List {selectedCrop.crop.split(' ')[0]} <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}