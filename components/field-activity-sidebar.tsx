"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sprout, Droplets, Scissors, Tractor, Loader2, Trash2 } from "lucide-react"
import { LogActivityForm } from "./log-activity-form"

interface Activity {
  id: string
  activity_date: string
  activity_type: string
  notes: string
  cost: number
}

export function FieldActivitySidebar({ fieldId, fieldName, isOpen, onClose }: { 
  fieldId: string, fieldName: string, isOpen: boolean, onClose: () => void 
}) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  const fetchActivities = useCallback(async () => {
    if (!fieldId) return
    setLoading(true)
    const { data } = await supabase
      .from("crop_activities")
      .select("*")
      .eq("field_id", fieldId)
      .order("activity_date", { ascending: false })
    
    setActivities(data || [])
    setLoading(false)
  }, [fieldId])

  // Function to remove an activity
  const deleteActivity = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity record?")) return

    const { error } = await supabase
      .from("crop_activities")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Failed to delete: " + error.message)
    } else {
      // Refresh local list
      setActivities((prev) => prev.filter((act) => act.id !== id))
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) fetchActivities()
  }, [isOpen, fetchActivities])

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
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-bold">{fieldName}</SheetTitle>
          <SheetDescription>Field Activity & History Log</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-8">
            {/* Form to log new activity */}
            <LogActivityForm fieldId={fieldId} onRefresh={fetchActivities} />
            
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Timeline</h4>
              
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
              ) : (
                <div className="space-y-3">
                  {activities.map((item) => (
                    <div key={item.id} className="group relative flex items-center justify-between gap-4 p-3 rounded-lg border bg-white shadow-sm hover:border-red-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 border">
                          {getIcon(item.activity_type)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.activity_type}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{new Date(item.activity_date).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">
                          KES {item.cost?.toLocaleString()}
                        </Badge>
                        
                        {/* DELETE BUTTON */}
                        <button 
                          onClick={() => deleteActivity(item.id)}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        >
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
      </SheetContent>
    </Sheet>
  )
}