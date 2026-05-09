"use client"

import React from 'react';
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav"; // This will contain our enhanced Hamburger
import { ModeToggle } from '@/components/mode-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Sidebar for Desktop - Updated with our brand colors */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-slate-900 dark:bg-black border-r border-slate-800">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-72">
        {/* Header - Fixed with Glassmorphism and Theme Support */}
        <header className="flex items-center p-4 md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
          <MobileNav />
          
          <div className="ml-4 flex items-center gap-2">
             <span className="font-black tracking-tighter text-xl text-slate-900 dark:text-white uppercase">
              Smart<span className="text-amber-500">Farm</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <ModeToggle />
          </div>
        </header>

        {/* Page Content Container */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)] animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}