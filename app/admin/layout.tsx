"use client";

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SidebarProvider, useSidebar } from '@/components/admin/SidebarContext';

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <>
      <AdminSidebar />
      <main className={`transition-all duration-300 p-8 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <AdminContent>{children}</AdminContent>
      </SidebarProvider>
    </div>
  );
}

