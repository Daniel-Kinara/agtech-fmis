import React from 'react';
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import {ModeToggle} from '@/components/mode-toggle';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-72">
        <header className="flex items-center p-4 md:hidden border-b bg-white sticky top-0 z-50">
          <MobileNav />
          <div className="ml-4 font-bold text-emerald-700 tracking-tight">SmartFarm</div>
          <div className="flex items-center space-x-4 ml-auto">
            <ModeToggle />
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}