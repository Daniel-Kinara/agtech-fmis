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
  Scissors, 
  Tractor, 
  Loader2, 
  Trash2, 
  History, 
  Beaker,
  Wheat,
  Calendar
} from "lucide-react"

// Import our sub-components
import { LogActivityForm } from "./log-activity-form"
import { SoilHealthLog } from "./soil-health-log"
import { HarvestLog } from "./harvest-log"

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

  // Fetch both activities and current field status (to know the crop)
  const fetchFieldContext = useCallback(async () => {
    if (!fieldId) return
    setLoading(true)
    
    try {
      // 1. Fetch Timeline
      const { data: actData } = await supabase
        .from("crop_activities")
        .select("*")
        .eq("field_id", fieldId)
        .order("activity_date", { ascending: false })
      
      // 2. Fetch Field Status/Crop
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

  const deleteActivity = async (id: string) => {
    if (!confirm("Delete this activity record?")) return
    const { error } = await supabase.from("crop_activities").delete().eq("id", id)
    if (!error) setActivities((prev) => prev.filter((act) => act.id !== id))
  }

  useEffect(() => {
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) fetchFieldContext()
  }, [isOpen, fetchFieldContext])

  const getIcon = (type: string) => {
    switch (type) {
      case 'Planting': return <Sprout className="h-4 w-4 text-emerald-500" />
      case 'Fertilizer': return <Droplets className="h-4 w-4 text-blue-500" />
      case 'Harvest': return <Scissors className="h-4 w-4 text-amber-500" />
      default: return <Tractor className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full border-l-emerald-100">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {fieldData?.status || "Loading..."}
            </Badge>
          </div>
          <SheetTitle className="text-2xl font-bold flex items-center gap-2">
            {fieldName}
          </SheetTitle>
          <SheetDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> 
            Field Management & Lifecycle Tracking
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="activities" className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="activities" className="text-xs gap-1.5">
              <History className="h-3.5 w-3.5" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="soil" className="text-xs gap-1.5">
              <Beaker className="h-3.5 w-3.5" /> Soil
            </TabsTrigger>
            <TabsTrigger value="harvest" className="text-xs gap-1.5">
              <Wheat className="h-3.5 w-3.5" /> Harvest
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: TIMELINE */}
          <TabsContent value="activities" className="mt-4">
            <ScrollArea className="h-[calc(100vh-240px)] pr-4">
              <div className="space-y-6">
                <LogActivityForm 
                  fieldId={fieldId} 
                  onRefresh={() => {
                    fetchFieldContext();
                    onFieldUpdate();
                  }} 
                />
                
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity Log</h4>
                  {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-600" /></div>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((item) => (
                        <div key={item.id} className="group relative flex items-center justify-between gap-4 p-3 rounded-xl border bg-white hover:border-emerald-200 transition-all shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                              {getIcon(item.activity_type)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{item.activity_type}</p>
                              <p className="text-[10px] text-slate-500">{new Date(item.activity_date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-600">
                              {item.cost > 0 ? `KES ${item.cost.toLocaleString()}` : ''}
                            </span>
                            <button onClick={() => deleteActivity(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* TAB 2: SOIL HEALTH */}
          <TabsContent value="soil" className="mt-4">
            <ScrollArea className="h-[calc(100vh-240px)] pr-4">
              <SoilHealthLog fieldId={fieldId} />
            </ScrollArea>
          </TabsContent>

          {/* TAB 3: HARVEST YIELD */}
          <TabsContent value="harvest" className="mt-4">
            <ScrollArea className="h-[calc(100vh-240px)] pr-4">
              <HarvestLog 
                fieldId={fieldId} 
                currentCrop={fieldData?.current_crop || null} 
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}