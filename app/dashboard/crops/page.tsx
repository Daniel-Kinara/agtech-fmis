"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Map as MapIcon, Calendar, Droplets } from "lucide-react"

// Mock data for farm parcels
const parcels = [
  { id: "P1", name: "North Field", crop: "Maize", health: 85, status: "Growing" },
  { id: "P2", name: "East Sector", crop: "Wheat", health: 92, status: "Mature" },
  { id: "P3", name: "South Block", crop: "Potatoes", health: 40, status: "Pest Alert" },
  { id: "P4", name: "West Side", crop: "Fallow", health: 100, status: "Idle" },
]

export default function CropsPage() {
  const [selectedParcel, setSelectedParcel] = useState(parcels[0])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MapIcon className="text-emerald-700" /> Digital Farm Map
        </h1>
        <p className="text-slate-500">Monitor parcel health and predictive yield analytics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: The Interactive Map Grid */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <div className="grid grid-cols-2 gap-4 aspect-video sm:aspect-square md:aspect-video">
            {parcels.map((parcel) => (
              <div 
                key={parcel.id}
                onClick={() => setSelectedParcel(parcel)}
                className={`relative rounded-lg border-4 cursor-pointer transition-all flex flex-col items-center justify-center p-4
                  ${selectedParcel.id === parcel.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'}
                `}
              >
                <Sprout className={parcel.health < 50 ? "text-red-500" : "text-emerald-600"} />
                <span className="font-bold mt-2">{parcel.name}</span>
                <Badge variant="outline" className="mt-1">{parcel.crop}</Badge>
                
                {/* Health Indicator bar */}
                <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${parcel.health < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${parcel.health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Parcel Details & Predictive Analytics */}
        <div className="space-y-6">
          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="text-xl">Parcel Details: {selectedParcel.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2"><Sprout size={16} /> Current Crop</span>
                <span className="font-semibold">{selectedParcel.crop}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2"><Calendar size={16} /> Est. Harvest</span>
                <span className="font-semibold text-emerald-700">Nov 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-2"><Droplets size={16} /> Soil Moisture</span>
                <span className="font-semibold text-blue-600">42%</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-bold text-slate-700 mb-1">Predictive Yield</h4>
                <p className="text-2xl font-bold">4.2 Tons/Ha</p>
                <p className="text-xs text-slate-500">+12% vs last season</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}