"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  User, 
  ShoppingBag 
} from "lucide-react"

const marketplaceItems = [
{
    id: 1,
    name: "Dry White Maize (Grade 1)",
    farmer: "Kiprono Farms",
    location: "Eldoret, Uasin Gishu",
    price: 5400,
    unit: "90kg Bag",
    stock: 45,
    healthIndex: "98%",
    harvestDate: "12 Oct 2026",
    // Reliable image of high-quality shelled maize
    image: "https://plus.unsplash.com/premium_photo-1675366068612-4f81985f36e4?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Fresh Red Onions",
    farmer: "Mama Mboga Co-op",
    location: "Karatina, Nyeri",
    price: 140,
    unit: "1kg",
    stock: 200,
    healthIndex: "95%",
    harvestDate: "20 Oct 2026",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=800",
  }
]

export default function MarketplacePage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Search and Filter Header */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Digital Farmers Market</h1>
          <p className="text-slate-500 font-medium">Buy direct, support farmers, and ensure food traceability.</p>
        </div>
        
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input 
            placeholder="Search for produce (e.g. Maize, Avocado, Beef)..." 
            className="pl-10 h-12 text-lg shadow-sm"
          />
        </div>
      </div>

      {/* Trust Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-900 p-6 rounded-2xl text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-emerald-400 h-8 w-8" />
          <div>
            <p className="font-bold">Verified Origin</p>
            <p className="text-xs text-emerald-200">Every bag is GPS-tagged</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-emerald-800 md:border-l md:pl-6">
          <Leaf className="text-emerald-400 h-8 w-8" />
          <div>
            <p className="font-bold">Organic Inputs</p>
            <p className="text-xs text-emerald-200">No harmful chemical pesticides</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-emerald-800 md:border-l md:pl-6">
          <User className="text-emerald-400 h-8 w-8" />
          <div>
            <p className="font-bold">Direct Payments</p>
            <p className="text-xs text-emerald-200">Farmer receives 95% of value</p>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {marketplaceItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
            <div className="relative h-48 bg-slate-200">
              <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  // If the image fails to load, this sets a generic "Green Farm" background
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800";}
              }/>
              <Badge className="absolute top-4 right-4 bg-white/90 text-emerald-800 backdrop-blur-sm border-none font-bold">
                Ksh {item.price.toLocaleString()} / {item.unit}
              </Badge>
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <MapPin size={14} /> {item.location}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center text-sm">
                <span className="text-slate-500">Traceability Score</span>
                <span className="font-bold text-emerald-600">{item.healthIndex}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Harvested: {item.harvestDate}</span>
                <span>Stock: {item.stock} units</span>
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button className="w-full bg-slate-900 hover:bg-slate-800 h-11 font-bold">
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}