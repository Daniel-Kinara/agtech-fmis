"use client"

import { useEffect, useState } from "react"
import { 
  Store, 
  TrendingUp, 
  MapPin, 
  ShoppingBag, 
  ArrowRight,
  Loader2,
  Search,
  Filter
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MarketItem {
  id: string
  commodity: string
  price: number
  unit: string
  market: string
  trend: 'up' | 'down' | 'stable'
  category: 'Crop' | 'Livestock'
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchMarketData() {
      try {
        // In a real production scenario, you would fetch from an API like:
        // const res = await fetch('https://api.kenyamarkets.co.ke/v1/prices')
        
        // Simulating the API response with local Kenyan market data
        const mockData: MarketItem[] = [
          { id: '1', commodity: 'Dry Maize', price: 5200, unit: '90kg Bag', market: 'Nairobi', trend: 'up', category: 'Crop' },
          { id: '2', commodity: 'Grade 1 Beef', price: 550, unit: 'per Kg', market: 'Mombasa', trend: 'stable', category: 'Livestock' },
          { id: '3', commodity: 'Red Onions', price: 110, unit: 'per Kg', market: 'Nairobi', trend: 'down', category: 'Crop' },
          { id: '4', commodity: 'Broiler Chicken', price: 800, unit: 'per Piece', market: 'Nakuru', trend: 'up', category: 'Livestock' },
          { id: '5', commodity: 'Irish Potatoes', price: 3800, unit: '50kg Bag', market: 'Eldoret', trend: 'up', category: 'Crop' },
        ]
        
        setItems(mockData)
      } catch (error) {
        console.error("Market fetch failed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
  }, [])

  const filteredItems = items.filter(item => 
    item.commodity.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatKES = (val: number) => 
    new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(val)

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-purple-500 h-10 w-10" />
    </div>
  )

  return (
    <div className="p-4 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-purple-500 mb-2 font-black uppercase tracking-widest text-[10px]">
            <Store className="h-4 w-4" /> Trading Floor
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">
            Market<span className="text-purple-500 text-opacity-80">place</span>
          </h1>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              placeholder="Search commodities..." 
              className="pl-10 bg-slate-900/50 border-white/10 text-white rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-white/10 bg-slate-900/50 text-white rounded-xl">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* MARKET GRID */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="bg-slate-900/40 border-white/5 overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${
                    item.category === 'Crop' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {item.category}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold">
                    <MapPin className="h-3 w-3" /> {item.market}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition-colors">
                    {item.commodity}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    Standard {item.unit}
                  </p>
                </div>

                <div className="flex items-end justify-between border-t border-white/5 pt-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase">Current Rate</p>
                    <p className="text-2xl font-black text-white">{formatKES(item.price)}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                    item.trend === 'up' ? 'text-emerald-500' : item.trend === 'down' ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${item.trend === 'down' ? 'rotate-180' : ''}`} />
                    {item.trend}
                  </div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-purple-500/10 hover:bg-purple-500 text-purple-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                Analyze Price History <ArrowRight className="h-3 w-3" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AGENT ADVICE BOX */}
      <div className="bg-slate-900/60 border border-purple-500/20 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="bg-purple-500/20 p-4 rounded-2xl">
          <ShoppingBag className="text-purple-500 h-8 w-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-white">SmartFarm Market Insight</h4>
          <p className="text-sm text-slate-400">
            Maize prices in <span className="text-white font-bold">Nairobi</span> have risen by 12% this week. Consider moving your current stock from the Eldoret storage to maximize profit margins.
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-xl px-8">
          Sell Now
        </Button>
      </div>
    </div>
  )
}