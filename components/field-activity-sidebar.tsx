"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sprout, 
  Droplets, 
  Tractor, 
  Loader2, 
  Trash2, 
  History, 
  Beaker,
  Wheat,
  Calendar,
  Layers,
  TrendingUp,
  X
} from "lucide-react"

import { LogActivityForm } from "./log-activity-form"
import { SoilHealthLog } from "./soil-health-log"
import { HarvestLog } from "./harvest-log"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  activity_date: string
  activity_type: string
  notes: string
  cost: number
}

interface FieldDetails {
  current_crop: string | null
  status: string
}

interface FieldActivitySidebarProps {
  fieldId: string
  fieldName: string
  isOpen: boolean
  onClose: () => void
  onFieldUpdate: () => void
}

export function FieldActivitySidebar({ 
  fieldId, 
  fieldName, 
  isOpen, 
  onClose,
  onFieldUpdate 
}: FieldActivitySidebarProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [fieldData, setFieldData] = useState<FieldDetails | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchFieldContext = useCallback(async () => {
    if (!fieldId) return
    setLoading(true)
    try {
      const { data: actData } = await supabase
        .from("crop_activities")
        .select("*")
        .eq("field_id", fieldId)
        .order("activity_date", { ascending: false })
      
      const { data: fData } = await supabase
        .from("fields")
        .select("current_crop, status")
        .eq("id", fieldId)
        .single()

      setActivities(actData || [])
      setFieldData(fData)
    } catch (err) {
      console.error("Error loading field context:", err)
    } finally {
      setLoading(false)
    }
  }, [fieldId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) fetchFieldContext()
  }, [isOpen, fetchFieldContext])

  const deleteActivity = async (id: string) => {
    const { error } = await supabase.from("crop_activities").delete().eq("id", id)
    if (!error) setActivities((prev) => prev.filter((act) => act.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'Planting': return <Sprout className="h-4 w-4 text-emerald-400" />
      case 'Fertilizer': return <Droplets className="h-4 w-4 text-sky-400" />
      case 'Harvest': return <TrendingUp className="h-4 w-4 text-amber-400" />
      default: return <Tractor className="h-4 w-4 text-slate-400" />
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full bg-slate-950 border-l border-slate-800 p-0 text-white overflow-hidden flex flex-col">
        
        {/* 1. Tactical Header (Referencing image_84ec15.png style) */}
        <div className="p-8 bg-slate-900/50 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[10px] font-black tracking-widest px-3 py-1">
              {fieldData?.status || "Active"}
            </Badge>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            <SheetTitle className="text-4xl font-black tracking-tighter text-white">
              {fieldName}
            </SheetTitle>
            <SheetDescription className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] flex items-center gap-2">
              <Layers className="h-3 w-3 text-amber-500" /> 
              Field Management & Lifecycle Tracking
            </SheetDescription>
          </div>
        </div>

        {/* 2. Unified Navigation Tabs */}
        <Tabs defaultValue="activities" className="flex-1 flex flex-col">
          <div className="px-6 py-4 bg-slate-900/30">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-white/5 p-1 rounded-xl">
              <TabsTrigger value="activities" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest gap-2">
                <History className="h-3.5 w-3.5" /> Timeline
              </TabsTrigger>
              <TabsTrigger value="soil" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest gap-2">
                <Beaker className="h-3.5 w-3.5" /> Soil
              </TabsTrigger>
              <TabsTrigger value="harvest" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest gap-2">
                <Wheat className="h-3.5 w-3.5" /> Harvest
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 3. Content Area with Professional Scroll styling */}
          <div className="flex-1 overflow-hidden px-6">
            <ScrollArea className="h-full pr-4 pb-8">
              
              {/* TIMELINE CONTENT */}
              <TabsContent value="activities" className="mt-0 space-y-8 animate-in slide-in-from-bottom-2 duration-300">
                {/* Floating Form Card */}
                <div className="bg-white rounded-[2rem] p-6 text-slate-900 shadow-2xl shadow-emerald-900/20">
                  <LogActivityForm 
                    fieldId={fieldId} 
                    onRefresh={() => { fetchFieldContext(); onFieldUpdate(); }} 
                  />
                </div>
                
                {/* Visual Activity Log */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 px-2">Activity Log</h4>
                  {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((item) => (
                        <div key={item.id} className="group relative flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
                              {getIcon(item.activity_type)}
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-white">{item.activity_type}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">
                                {new Date(item.activity_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                              {item.cost > 0 ? `KES ${item.cost.toLocaleString()}` : '—'}
                            </span>
                            <button 
                              onClick={() => deleteActivity(item.id)} 
                              className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* SOIL CONTENT */}
              <TabsContent value="soil" className="mt-0 animate-in slide-in-from-bottom-2 duration-300">
                <SoilHealthLog fieldId={fieldId} />
              </TabsContent>

              {/* HARVEST CONTENT */}
              <TabsContent value="harvest" className="mt-0 animate-in slide-in-from-bottom-2 duration-300">
                <HarvestLog 
                  fieldId={fieldId} 
                  currentCrop={fieldData?.current_crop || null} 
                />
              </TabsContent>

            </ScrollArea>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}