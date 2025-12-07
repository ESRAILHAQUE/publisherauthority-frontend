"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SidebarProvider, useSidebar } from "@/components/admin/SidebarContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      <AdminSidebar />
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}>
        <AdminHeader />
        <main className="p-8">{children}</main>
      </div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <SidebarProvider>
          <AdminContent>{children}</AdminContent>
        </SidebarProvider>
      </div>
    </AuthGuard>
  );
}
