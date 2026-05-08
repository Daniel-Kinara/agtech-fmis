import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Beef, 
  Sprout, 
  ShoppingCart, 
  LineChart, 
  Settings,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Livestock', href: '/dashboard/livestock', icon: Beef },
    { name: 'Crops', href: '/dashboard/crops', icon: Sprout },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingCart },
    { name: 'Price Tracker', href: '/dashboard/prices', icon: LineChart },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-green-700 tracking-tight">SmartFarm</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-green-700 rounded-lg transition-colors font-medium"
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-500">
            <Settings size={20} />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-700">SmartFarm</h2>
          <Button variant="outline" size="icon">
            <Menu size={20} />
          </Button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}