"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Droplets, 
  FlaskConical, 
  Sprout, 
  Calendar,
  Plus
} from "lucide-react"

// Mock Activity Data
const activities = [
  {
    id: 1,
    date: "May 05, 2026",
    action: "Fertilizer Application",
    details: "Applied NPK 17-17-17 to North Field (Maize)",
    type: "input",
    icon: FlaskConical,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    date: "May 02, 2026",
    action: "Irrigation Cycle",
    details: "Automated drip system active for 4 hours",
    type: "maintenance",
    icon: Droplets,
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  },
  {
    id: 3,
    date: "April 28, 2026",
    action: "Germination Check",
    details: "92% germination rate observed in West Side potatoes",
    type: "observation",
    icon: Sprout,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  }
]

export default function ActivityTimeline() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Crop Activity Timeline</h1>
          <p className="text-slate-500">History of interventions and field observations.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" /> Log Activity
        </Button>
      </div>

      <div className="relative">
        {/* The Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

        <div className="space-y-8">
          {activities.map((item) => (
            <div key={item.id} className="relative flex flex-col md:flex-row gap-6 md:gap-10">
              {/* Date Indicator (Mobile: Text, Desktop: Circle on Line) */}
              <div className="hidden md:flex absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-emerald-500 z-10" />
              
              <div className="md:w-32 pt-1">
                <span className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  <Calendar size={14} /> {item.date}
                </span>
              </div>

              <Card className="flex-1 shadow-sm hover:shadow-md transition-shadow border-slate-200">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${item.bg}`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">{item.action}</h3>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.details}
                    </p>
                    <div className="pt-2 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 size={12} /> Verified Entry
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Insight */}
      <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
        <CardContent className="p-6 text-center">
          <p className="text-slate-500 text-sm italic">
            &quot;Every logged activity increases your Marketplace Traceability Score. Keep your records updated to attract premium buyers.&quot;
          </p>
        </CardContent>
      </Card>
    </div>
  )
}