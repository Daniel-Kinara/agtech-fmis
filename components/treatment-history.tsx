"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Syringe } from "lucide-react"

interface Treatment {
  id: string
  treatment_date: string
  medicine_name: string
  dosage: string
  reason: string
}

export function TreatmentHistory({ animalId, animalTag, isOpen, onClose }: { 
  animalId: string, 
  animalTag: string, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchTreatments = async () => {
        setLoading(true)
        const { data } = await supabase
          .from("treatments")
          .select("*")
          .eq("animal_id", animalId)
          .order("treatment_date", { ascending: false })
        
        setTreatments(data || [])
        setLoading(false)
      }
      fetchTreatments()
    }
  }, [isOpen, animalId])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-emerald-600" />
            Medical History: {animalTag}
          </SheetTitle>
          <SheetDescription>Past vaccinations and treatments.</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
          ) : treatments.length === 0 ? (
            <p className="text-center text-slate-500 py-10">No medical records found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treatments.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{new Date(t.treatment_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{t.medicine_name}</TableCell>
                    <TableCell>{t.dosage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}