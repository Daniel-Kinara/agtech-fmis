"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Loader2, Trash2, AlertCircle } from "lucide-react"
import { LivestockStats } from "@/components/livestock-stats"
import { supabase } from "@/lib/supabase"
import { AddLivestockForm } from "@/components/add-livestock-form"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TreatmentHistory } from "@/components/treatment-history"

// Define the shape of your livestock data
interface Livestock {
  id: string
  tag_number: string
  species: string
  breed: string
  status: string
  weight: number | null
  created_at: string
}

export default function LivestockPage() {
  const [livestock, setLivestock] = useState<Livestock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<{id: string, tag: string} | null>(null);

  const fetchLivestock = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: supabaseError } = await supabase
        .from("livestock")
        .select("*")
        .order("created_at", { ascending: false })

      if (supabaseError) throw supabaseError
      setLivestock(data || [])
    } catch (err) {
      const {message} = err as {message: string}
      setError(message || "Failed to load livestock data.")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteAnimal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this animal?")) return

    try {
      const { error: deleteError } = await supabase
        .from("livestock")
        .delete()
        .eq("id", id)

      if (deleteError) throw deleteError
      setLivestock((prev) => prev.filter((animal) => animal.id !== id))
    } catch (err) {
      const {message} = err as {message: string}
      setError(message || "Failed to delete animal.")
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLivestock()
  }, [fetchLivestock])

  return (
    <div className="flex-col flex min-h-screen bg-slate-50/50">
      {/* 
          Responsiveness: 
          - p-4 for mobile, md:p-8 for desktop 
      */}
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        
        {/* Header Section: flex-col on mobile, flex-row on desktop */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Livestock Inventory</h2>
            <p className="text-sm text-muted-foreground">Manage your herd records and health status.</p>
          </div>
          <div className="w-full sm:w-auto">
            <AddLivestockForm onRefresh={fetchLivestock} />
          </div>
        </div>

        {/* Stats: Handled by component, but ensure parent container is full width */}
        <div className="w-full">
          <LivestockStats data={livestock}/>
        </div>

        {/* Error Handling UI */}
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle>Herd Management</CardTitle>
            <CardDescription>Real-time sync with Kajiado Cloud database.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                <p className="text-slate-500 font-medium">Syncing data...</p>
              </div>
            ) : livestock.length === 0 ? (
              <div className="mx-4 mb-4 text-center py-16 border-2 border-dashed rounded-xl border-slate-200">
                <p className="text-slate-400">No animals registered yet.</p>
              </div>
            ) : (
              /* 
                 Responsiveness: 
                 - overflow-x-auto allows the table to scroll horizontally on phones
                 - min-w forces the table to maintain readable column widths 
              */
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-semibold whitespace-nowrap">Tag Number</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">Species</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap hidden md:table-cell">Breed</TableHead>
                      <TableHead className="font-semibold whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right font-semibold whitespace-nowrap">Weight</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {livestock.map((animal) => (
                      <TableRow 
                        key={animal.id} 
                        className="cursor-pointer hover:bg-slate-50/50 transition-colors" 
                        onClick={() => setSelectedAnimal({id: animal.id, tag: animal.tag_number})}
                      >
                        <TableCell className="font-bold text-slate-700 whitespace-nowrap">
                          {animal.tag_number}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{animal.species}</TableCell>
                        <TableCell className="hidden md:table-cell whitespace-nowrap">
                          {animal.breed}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                            animal.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {animal.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-600 whitespace-nowrap">
                          {animal.weight ? `${animal.weight.toFixed(1)} kg` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening treatment history when deleting
                              deleteAnimal(animal.id);
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            aria-label="Delete animal"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TreatmentHistory
        isOpen={!!selectedAnimal}
        onClose={() => setSelectedAnimal(null)}
        animalId={selectedAnimal?.id || ""}
        animalTag={selectedAnimal?.tag || ""}
      />
    </div>
  )
}