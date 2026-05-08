import React from 'react';
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar - Fixed position on Desktop */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Main Content Area - Shifted right on Desktop to make room for fixed sidebar */}
      <main className="flex-1 md:pl-72">
        {/* Optional: Add a Mobile Header here later if needed */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}