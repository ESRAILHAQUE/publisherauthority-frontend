"use client";

import React from "react";
import {
  Sidebar,
  DashboardSidebarProvider,
  useDashboardSidebar,
} from "@/components/dashboard/Sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="publisher">
      <DashboardSidebarProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </DashboardSidebarProvider>
    </AuthGuard>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useDashboardSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={`${
          isCollapsed ? "ml-20" : "ml-64"
        } p-8 transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}
