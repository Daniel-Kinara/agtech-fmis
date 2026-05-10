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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Syringe, History, AlertCircle, Trash2, ShieldCheck } from "lucide-react"
import { AddTreatmentForm } from "./add-treatment-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Treatment {
  id: string
  treatment_date: string
  medicine_name: string
  dosage: string
  reason: string
}

interface TreatmentHistoryProps {
  animalId: string
  animalTag: string
  isOpen: boolean
  onClose: () => void
}

export function TreatmentHistory({ 
  animalId, 
  animalTag, 
  isOpen, 
  onClose 
}: TreatmentHistoryProps) {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchTreatments = useCallback(async () => {
    if (!animalId) return
    try {
      setLoading(true)
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from("treatments")
        .select("*")
        .eq("animal_id", animalId)
        .order("treatment_date", { ascending: false })

      if (supabaseError) throw supabaseError
      setTreatments(data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [animalId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) fetchTreatments()
  }, [isOpen, fetchTreatments])

  // EFFECTIVE DELETE HANDLER
  async function handleDelete(id: string) {
    try {
      setDeletingId(id)
      const { error: deleteError } = await supabase
        .from("treatments")
        .delete()
        .eq("id", id)

      if (deleteError) throw deleteError
      
      // Update local state immediately for a "snappy" feel
      setTreatments((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
      setError("Failed to purge medical record. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full bg-[#0a0b10] border-l border-white/5 p-0 text-white flex flex-col overflow-hidden">
        
        {/* Fixed Header */}
        <div className="shrink-0 p-8 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 z-10">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <Syringe className="h-4 w-4 fill-emerald-400/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Bio-Medical Telemetry</span>
          </div>
          <SheetTitle className="text-3xl font-black tracking-tighter text-white">
            Tag {animalTag}
          </SheetTitle>
          <SheetDescription className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Health Intervention Archive
          </SheetDescription>
        </div>

        {/* Scrollable Log */}
        <ScrollArea className="flex-1">
          <div className="px-8 py-6 space-y-10">
            
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500">Record Intervention</h4>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="bg-[#16181d] rounded-2xl p-4 border border-white/5 shadow-inner">
                <AddTreatmentForm animalId={animalId} onRefresh={fetchTreatments} />
              </div>
            </section>

            <section className="space-y-4 pb-12">
              <div className="flex items-center justify-between">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <History className="h-3 w-3" /> Protocol Logs
                </h4>
                <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-black">
                  {treatments.length} UNITS
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-[10px] font-bold uppercase tracking-tight">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}

              <div className="rounded-2xl border border-white/5 bg-[#16181d]/50 overflow-hidden shadow-2xl">
                <Table>
                  <TableHeader className="bg-slate-900/60 border-b border-white/5">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-3 pl-4">Date</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-3">Details</TableHead>
                      <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-500 py-3 text-right">Dose</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && treatments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center">
                          <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : treatments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                          Empty Log
                        </TableCell>
                      </TableRow>
                    ) : (
                      treatments.map((t) => (
                        <TableRow key={t.id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                          <TableCell className="text-[10px] font-bold text-slate-500 py-4 pl-4">
                            {new Date(t.treatment_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="text-[11px] font-black text-slate-200 uppercase tracking-tight line-clamp-1">{t.medicine_name}</div>
                            <div className="text-[9px] text-slate-500 font-bold uppercase line-clamp-1 mt-0.5">{t.reason}</div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <span className="text-[10px] font-mono font-black text-emerald-400">
                              {t.dosage}
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-4 pr-3">
                            <button 
                              onClick={() => handleDelete(t.id)}
                              disabled={deletingId === t.id}
                              className={cn(
                                "p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50",
                                deletingId === t.id 
                                  ? "text-slate-400" 
                                  : "text-slate-600 hover:text-rose-500 hover:bg-rose-500/10"
                              )}
                            >
                              {deletingId === t.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}