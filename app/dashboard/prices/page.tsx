"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { 
  TrendingUp, Info, Loader2, ArrowUpRight, Calculator, X 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MarketPricesPage() {
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<{ name: string, quantity: number }[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Current Market Rates (Mocked for Nairobi)
  const marketRates = { maize: 5600, beans: 9550 }

  useEffect(() => {
    async function fetchInventory() {
      // Pulling current stock levels from your crops table
      const { data } = await supabase.from("crops").select("crop_type, current_stock")
      
      if (data) {
        const formatted = data.map(d => ({
          name: d.crop_type,
          quantity: d.current_stock || 0
        }))
        setInventory(formatted)
      }
      setLoading(false)
    }
    fetchInventory()
  }, [])

  const formatKES = (val: number) => 
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val)

  const totalPotentialValue = inventory.reduce((acc, item) => {
    const rate = item.name.toLowerCase().includes('maize') ? marketRates.maize : marketRates.beans
    return acc + (item.quantity * rate)
  }, 0)

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-amber-500 h-10 w-10" /></div>

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Existing Header & Chart logic... */}

      {/* MARKET INTELLIGENCE BOX WITH LIVE CALCULATION */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Calculator className="h-32 w-32 text-amber-500" />
        </div>

        <div className="flex-1 space-y-4 relative z-10">
           <div className="flex items-center gap-3 text-amber-500">
              <Info className="h-6 w-6" />
              <h3 className="text-lg font-black uppercase tracking-tighter">Selling Recommendation</h3>
           </div>
           <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xl">
             Your current inventory of <span className="text-white font-bold">{inventory.length} crop types</span> is valued at peak market rates. Based on Nairobi&apos;s current <span className="text-amber-500 font-bold">{formatKES(marketRates.maize)}/bag</span> maize index, we suggest a partial liquidation.
           </p>
        </div>

        <div className="text-center md:text-right relative z-10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estimated Value</p>
            <p className="text-4xl font-black text-white mb-4">{formatKES(totalPotentialValue)}</p>
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl px-8"
            >
                View Breakdown
            </Button>
        </div>
      </div>

      {/* PROFIT BREAKDOWN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-[#111218] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5">
              <CardTitle className="text-sm font-black uppercase text-amber-500">Liquidation Estimate</CardTitle>
              <X className="h-4 w-4 text-slate-500 cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {inventory.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-xs font-black text-white uppercase">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{item.quantity} Units in Stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">
                        {formatKES(item.quantity * (item.name.toLowerCase().includes('maize') ? marketRates.maize : marketRates.beans))}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2">
                <Button className="w-full bg-white text-black font-black uppercase text-[10px] tracking-widest h-12">
                   Post to Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}