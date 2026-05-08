import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Package, AlertCircle } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { name: "Total Revenue", value: "$12,450", icon: TrendingUp, color: "text-green-600" },
    { name: "Active Orders", value: "14", icon: Package, color: "text-blue-600" },
    { name: "Workforce", value: "8", icon: Users, color: "text-purple-600" },
    { name: "Pending Alerts", value: "3", icon: AlertCircle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Farm Overview</h1>
        <p className="text-slate-500">Real-time health and financial performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.name}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Financial Charts */}
      <Card className="h-[300px] flex items-center justify-center border-dashed">
        <p className="text-slate-400 font-medium">Financial Analytics Chart (Coming Soon)</p>
      </Card>
    </div>
  );
}