"use client"

import React, { useEffect, useState } from "react"
import { AddLivestockForm } from "@/components/add-livestock-form"
import { Plus, Table as TableIcon, Activity, Database } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
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

// Define what a "Livestock" object looks like
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

  // 1. Fetch data from Supabase on page load
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
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Livestock Inventory</h2>
          <div className="flex items-center space-x-2">
            <AddLivestockForm onRefresh={() => window.location.reload()} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{livestock.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Herd Overview</CardTitle>
            <CardDescription>
              A real-time list of your animals from the Supabase database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-24">
                <Database className="mr-2 h-5 w-5 animate-spin text-emerald-500" />
                <span>Connecting to Kajiado Data Hub...</span>
              </div>
            ) : livestock.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <TableIcon className="h-10 w-10 text-slate-300 mb-4" />
                <h3 className="font-semibold text-lg">No livestock found</h3>
                <p className="text-slate-500 max-w-sm">
                  Your database table is currently empty. Add a row in Supabase or use the button above.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag Number</TableHead>
                    <TableHead>Species</TableHead>
                    <TableHead>Breed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Added On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livestock.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell className="font-medium">{animal.tag_number}</TableCell>
                      <TableCell>{animal.species}</TableCell>
                      <TableCell>{animal.breed}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                          {animal.status}
                        </span>
                        <TableCell className="text-right font-mono">
                        {animal.weight ? `${animal.weight} kg` : "-"}
                        </TableCell>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(animal.created_at).toLocaleDateString()}
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