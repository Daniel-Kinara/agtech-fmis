"use client"

import React, { useEffect, useState, useCallback } from "react"
import { Trash2, ChevronRight, Store } from "lucide-react"
import { LivestockStats } from "@/components/livestock-stats"
import { supabase } from "@/lib/supabase"
import { AddLivestockForm } from "@/components/add-livestock-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TreatmentHistory } from "@/components/treatment-history"
import { Button } from "@/components/ui/button"
import { ListAssetModal } from "@/components/marketPlace/ListAssestModal" 

export default function LivestockPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [livestock, setLivestock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnimal, setSelectedAnimal] = useState<{id: string, tag: string} | null>(null)
  
  // State for Marketplace Modal
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listingAnimal, setListingAnimal] = useState<any | null>(null)

  const fetchLivestock = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await supabase.from("livestock").select("*").order("created_at", { ascending: false })
      setLivestock(data || [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchLivestock() }, [fetchLivestock])
  
  const deleteField = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation()
    if (!confirm(`Delete "${name}"?`)) return 
    await supabase.from("livestock").delete().eq("id", id)
    fetchLivestock()
  }

  return (
    <div className="flex-col flex min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Livestock Inventory</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Herd records and health monitoring.</p>
          </div>
          <div className="w-full sm:w-auto">
            <AddLivestockForm onRefresh={fetchLivestock} />
          </div>
        </div>

        <LivestockStats data={livestock} />

        <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <CardHeader className="bg-white dark:bg-slate-900 p-6">
            <CardTitle className="text-slate-900 dark:text-slate-100">Herd Management</CardTitle>
            <CardDescription className="dark:text-slate-400 text-xs">Real-time sync with Kajiado Cloud.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="dark:text-slate-300 font-bold uppercase text-[10px]">Tag</TableHead>
                    <TableHead className="dark:text-slate-300 font-bold uppercase text-[10px]">Species</TableHead>
                    <TableHead className="dark:text-slate-300 font-bold uppercase text-[10px]">Status</TableHead>
                    <TableHead className="text-right dark:text-slate-300 font-bold uppercase text-[10px]">Weight</TableHead>
                    <TableHead className="dark:text-slate-300 font-bold uppercase text-[10px] text-center">Marketplace</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livestock.map((animal) => (
                    <TableRow 
                      key={animal.id} 
                      className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800"
                      onClick={() => setSelectedAnimal({ id: animal.id, tag: animal.tag_number })}
                    >
                      <TableCell className="font-black text-slate-800 dark:text-slate-100">{animal.tag_number}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{animal.species}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          animal.status === 'Healthy' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {animal.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-600 dark:text-slate-400">
                        {animal.weight ? `${animal.weight}kg` : "-"}
                      </TableCell>
                      
                      <TableCell className="text-center">
                        <Button 
                          size="sm"
                          variant={animal.market_status === 'listed' ? "secondary" : "outline"}
                          className="h-7 text-[10px] font-bold uppercase gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            setListingAnimal(animal) // Open Modal
                          }}
                          disabled={animal.market_status === 'listed'}
                        >
                          <Store className="h-3 w-3 text-emerald-600" />
                          {animal.market_status === 'listed' ? 'Listed' : 'Enlist'}
                        </Button>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => deleteField(e, animal.id, animal.tag_number)} className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals Section */}
      <TreatmentHistory 
        isOpen={!!selectedAnimal} 
        onClose={() => setSelectedAnimal(null)} 
        animalId={selectedAnimal?.id || ""} 
        animalTag={selectedAnimal?.tag || ""} 
      />

      <ListAssetModal 
        isOpen={!!listingAnimal} 
        onClose={() => setListingAnimal(null)} 
        asset={listingAnimal} 
        onSuccess={fetchLivestock} // Re-fetches database on success
      />
    </div>
  )
}