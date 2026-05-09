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
import { Loader2, Syringe, History, AlertCircle } from "lucide-react"
import { AddTreatmentForm } from "./add-treatment-form"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const [error, setError] = useState<string | null>(null)

  // Fetch function wrapped in useCallback so it can be passed to the form
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
      const error = err as Error
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [animalId])

  // Trigger fetch when the sidebar opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTreatments()
    }
  }, [isOpen, fetchTreatments])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Syringe className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Medical Log</span>
          </div>
          <SheetTitle className="text-2xl font-bold">Animal {animalTag}</SheetTitle>
          <SheetDescription>
            Record and track all vaccinations and medical interventions.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] pr-4 mt-6">
          <div className="space-y-8">
            {/* 1. Add New Treatment Form */}
            <section className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                New Entry
              </h4>
              <AddTreatmentForm animalId={animalId} onRefresh={fetchTreatments} />
            </section>

            {/* 2. Past History Table */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-slate-400" />
                  Treatment History
                </h4>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                  {treatments.length} RECORDS
                </span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {loading && treatments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  <p className="text-xs text-slate-400">Loading history...</p>
                </div>
              ) : treatments.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <p className="text-sm text-slate-400">No medical history found.</p>
                </div>
              ) : (
                <div className="rounded-md border border-slate-100 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="text-[10px] font-bold">DATE</TableHead>
                        <TableHead className="text-[10px] font-bold">MEDICINE</TableHead>
                        <TableHead className="text-[10px] font-bold text-right">DOSAGE</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {treatments.map((t) => (
                        <TableRow key={t.id} className="hover:bg-transparent">
                          <TableCell className="text-xs text-slate-500 py-3">
                            {new Date(t.treatment_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="py-3">
                            <div className="text-xs font-bold text-slate-700">{t.medicine_name}</div>
                            <div className="text-[10px] text-slate-400 italic line-clamp-1">{t.reason}</div>
                          </TableCell>
                          <TableCell className="text-right text-xs font-mono text-emerald-600 py-3">
                            {t.dosage}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}