"use client"

import React, { useEffect, useState } from "react"
import { Database, Loader2 } from "lucide-react"
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

// 1. Updated Interface - This fixes the "property does not exist" error
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

  const fetchLivestock = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("livestock")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setLivestock(data || [])
    } catch (error) {
      console.error("Error loading livestock:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("livestock")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setLivestock(data || [])
      } catch (error) {
        console.error("Error loading livestock:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLivestock()
  }, [])

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Livestock Inventory</h2>
          {/* Passing the fetch function to the form so it can refresh the list */}
          <AddLivestockForm onRefresh={fetchLivestock} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Herd Management</CardTitle>
            <CardDescription>Real-time data from your Supabase database.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <span className="ml-2">Fetching data...</span>
              </div>
            ) : livestock.length === 0 ? (
              <div className="text-center py-10 text-slate-500 border-2 border-dashed rounded-lg">
                No livestock found. Click &quot;Add Livestock&quot; to begin.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag Number</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Weight (kg)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livestock.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-bold">{animal.tag_number}</TableCell>
                      <TableCell>{animal.species}</TableCell>
                      <TableCell>{animal.breed}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {animal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {animal.weight ? `${animal.weight} kg` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}