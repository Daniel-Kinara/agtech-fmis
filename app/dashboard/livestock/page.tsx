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

  // 1. Fetch logic wrapped in useCallback to prevent unnecessary re-renders
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

  // 2. Delete logic
  const deleteAnimal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this animal?")) return

    try {
      const { error: deleteError } = await supabase
        .from("livestock")
        .delete()
        .eq("id", id)

      if (deleteError) throw deleteError
      
      // Update local state immediately
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
      <div className="flex-1 space-y-4 p-8 pt-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Livestock Inventory</h2>
            <p className="text-sm text-muted-foreground">Manage your herd records and health status.</p>
          </div>
          <AddLivestockForm onRefresh={fetchLivestock} />
        </div>
        <LivestockStats data={livestock}/>

        {/* Error Handling UI */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Herd Management</CardTitle>
            <CardDescription>Real-time sync with Kajiado Cloud database.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                <p className="text-slate-500 font-medium">Syncing data...</p>
              </div>
            ) : livestock.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-xl border-slate-200">
                <p className="text-slate-400">No animals registered yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="font-semibold">Tag Number</TableHead>
                    <TableHead className="font-semibold">Species</TableHead>
                    <TableHead className="font-semibold">Breed</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">Weight (kg)</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livestock.map((animal) => (
                    <TableRow key={animal.id} className="cursor-pointer hover:bg-slate-50/50" onClick={() => setSelectedAnimal({id: animal.id, tag: animal.tag_number})}>
                      <TableCell className="font-bold text-slate-700">{animal.tag_number}</TableCell>
                      <TableCell>{animal.species}</TableCell>
                      <TableCell>{animal.breed}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          animal.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {animal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-600">
                        {animal.weight ? `${animal.weight.toFixed(1)} kg` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <button 
                          onClick={() => deleteAnimal(animal.id)}
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