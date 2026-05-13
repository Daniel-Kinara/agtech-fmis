"use client"
import { Card, CardContent } from '@/components/ui/card';
import { useFarm } from '@/services/context/FarmContext';
import { Beef, TrendingUp } from 'lucide-react';

export default function SmartFarmDashboard() {
  const { livestock, crops, market, loading } = useFarm();

  // 1. Dynamic Financials (Replacing hardcoded Ksh)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalRevenue = livestock.reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

  const summaryStats = [
    { label: "Total Revenue", value: `Ksh ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Livestock Count", value: `${livestock.length} Head`, icon: Beef, color: "text-blue-600", bg: "bg-blue-50" },
    // ... other stats
  ];

  if (loading) return <div className="p-10 animate-pulse text-slate-400">Loading SmartFarm Data...</div>;

  return (
    <div className="space-y-8 pb-10">
      {/* ... Your Welcome Header ... */}

      {/* 2. Key Metrics (Now Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label}>
             {/* Rendered identically to your code, but using dynamic 'stat.value' */}
          </Card>
        ))}
      </div>

      {/* 5. Strategic Insight (Now Smart) */}
      <Card className="bg-slate-900 text-white">
        <CardContent className="p-8">
          <p className="text-slate-300">
            Maize prices in <span className="text-white font-bold">Nairobi</span> are currently 
            <span className="text-emerald-400 font-bold ml-1">Ksh {market?.maize ?? 'Fetching...'}</span>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}