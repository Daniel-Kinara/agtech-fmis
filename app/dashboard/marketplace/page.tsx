"use client"

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, MapPin, Loader2, RefreshCcw } from "lucide-react"

export default function MarketplacePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    setLoading(true)
    // CRITICAL: Fetching from the marketplace table where status is 'active'
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (!error) setListings(data || [])
    setListings(data || [])
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchListings()
  }, [])

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AgTech Marketplace</h1>
          <p className="text-slate-500">Live listings from Kajiado & Nairobi producers.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchListings} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
          Refresh Listings
        </Button>
      </div>

      {listings.length === 0 && !loading ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-slate-400">No active listings. Go to Livestock or Crops to enlist assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Card key={item.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {item.asset_type === 'livestock' ? 'Livestock' : 'Crops'}
                  </Badge>
                  <span className="font-bold text-emerald-600 font-mono text-lg">
                    Ksh {item.price_ksh?.toLocaleString()}
                  </span>
                </div>
                <CardTitle className="mt-2 text-xl">{item.asset_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {item.location || "Nairobi, KE"}
                </div>
                <div className="flex justify-between text-sm py-2 border-y border-slate-50">
                  <span>Quantity</span>
                  <span className="font-bold">{item.quantity}</span>
                </div>
                <Button className="w-full bg-slate-900 hover:bg-emerald-600">
                  <ShoppingCart className="h-4 w-4 mr-2" /> Purchase Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}