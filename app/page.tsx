import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Beef, Sprout, Tractor, ArrowRight } from "lucide-react";

export default function EntryPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Welcome to SmartFarm
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            The all-in-one management system for modern agriculture. 
            Tell us about your operation to get started.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Livestock Card */}
          <RoleCard 
            title="Livestock Farmer"
            description="Manage herd health, breeding cycles, and performance metrics with frictionless entry."
            icon={<Beef className="w-10 h-10 text-green-600" />}
            href="/dashboard/livestock"
            color="hover:border-green-500"
          />

          {/* Crop Card */}
          <RoleCard 
            title="Crop Farmer"
            description="Geospatial-first tracking with digital farm maps and predictive yield analytics."
            icon={<Sprout className="w-10 h-10 text-emerald-600" />}
            href="/dashboard/crops"
            color="hover:border-emerald-500"
          />

          {/* Integrated Card */}
          <RoleCard 
            title="Mixed Farming"
            description="Full access to both modules, marketplace, and unified financial dashboards."
            icon={<Tractor className="w-10 h-10 text-blue-600" />}
            href="/dashboard"
            color="hover:border-blue-500"
          />

        </div>
      </div>
    </main>
  );
}

// Reusable Sub-component for the cards
function RoleCard({ title, description, icon, href, color }: { 
  title: string, description: string, icon: React.ReactNode, href: string, color: string 
}) {
  return (
    <Link href={href}>
      <Card className={`group h-full transition-all duration-300 border-2 cursor-pointer ${color} hover:shadow-lg`}>
        <CardHeader className="space-y-4">
          <div className="p-3 bg-slate-100 rounded-2xl w-fit group-hover:bg-white transition-colors">
            {icon}
          </div>
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base mt-2">{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
            Enter Dashboard <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}