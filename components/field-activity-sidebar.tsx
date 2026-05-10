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
  Layers,
  TrendingUp,
  X,
  PlusCircle
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
      <SheetContent className="sm:max-w-md w-full bg-[#0a0b10] border-l border-white/5 p-0 text-white flex flex-col">
        
        {/* 1. FIXED HEADER: Stays visible regardless of scroll */}
        <div className="p-6 bg-slate-900/20 backdrop-blur-md border-b border-white/5 z-10">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5">
              {fieldData?.status || "Active"}
            </Badge>
            <button 
              onClick={onClose} 
              className="h-8 w-8 flex items-center justify-center bg-slate-800/50 hover:bg-slate-700 rounded-full transition-all text-slate-400 border border-white/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            <SheetTitle className="text-3xl font-black tracking-tighter text-white">
              {fieldName}
            </SheetTitle>
            <div className="text-[9px] text-slate-500 uppercase font-black tracking-[0.25em] flex items-center gap-2">
              <Layers className="h-3 w-3 text-amber-500/80" /> 
              Live Context Analysis
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION TABS: Also fixed for easy switching */}
        <Tabs defaultValue="activities" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-4 bg-[#0a0b10]">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/80 border border-white/5 p-1 rounded-xl h-11">
              <TabsTrigger value="activities" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-[9px] font-black uppercase tracking-widest gap-2 rounded-lg">
                <History className="h-3.5 w-3.5" /> Timeline
              </TabsTrigger>
              <TabsTrigger value="soil" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-[9px] font-black uppercase tracking-widest gap-2 rounded-lg">
                <Beaker className="h-3.5 w-3.5" /> Soil
              </TabsTrigger>
              <TabsTrigger value="harvest" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-[9px] font-black uppercase tracking-widest gap-2 rounded-lg">
                <Wheat className="h-3.5 w-3.5" /> Harvest
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 3. SCROLLABLE CONTENT AREA */}
          <div className="flex-1 min-h-0 px-6">
            <ScrollArea className="h-full pr-4 overflow-y-auto custom-scrollbar">
              
              {/* TIMELINE CONTENT */}
              <TabsContent value="activities" className="mt-0 space-y-6 pb-12 animate-in slide-in-from-bottom-2 duration-300">
                {/* Form Module */}
                <LogActivityForm 
                  fieldId={fieldId} 
                  onRefresh={() => { fetchFieldContext(); onFieldUpdate(); }} 
                />
                
                {/* Visual History Log */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Activity Protocol History</h4>
                    <div className="h-px flex-1 bg-white/5 ml-4" />
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-50">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Fetching Logs...</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activities.length > 0 ? activities.map((item) => (
                        <div key={item.id} className="group relative flex items-center justify-between gap-4 p-3.5 rounded-xl border border-white/[0.03] bg-slate-900/30 hover:bg-slate-800/40 hover:border-white/10 transition-all duration-200">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-white/5 group-hover:scale-105 transition-transform shadow-inner">
                              {getIcon(item.activity_type)}
                            </div>
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-wider text-slate-200">{item.activity_type}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">
                                {new Date(item.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {item.cost > 0 && (
                              <span className="text-[10px] font-black text-emerald-400/90 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
                                KES {item.cost.toLocaleString()}
                              </span>
                            )}
                            <button 
                              onClick={() => deleteActivity(item.id)} 
                              className="p-2 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              title="Purge Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 bg-slate-900/20 rounded-2xl border border-dashed border-white/5">
                          <p className="text-[10px] uppercase font-black tracking-widest text-slate-600">No telemetry recorded</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* SOIL CONTENT */}
              <TabsContent value="soil" className="mt-0 pb-12 animate-in slide-in-from-bottom-2 duration-300">
                <SoilHealthLog fieldId={fieldId} />
              </TabsContent>

              {/* HARVEST CONTENT */}
              <TabsContent value="harvest" className="mt-0 pb-12 animate-in slide-in-from-bottom-2 duration-300">
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