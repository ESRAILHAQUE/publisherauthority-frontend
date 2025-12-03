'use client';

import React from 'react';
import { Sidebar, DashboardSidebarProvider } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardSidebarProvider>
  );
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    // Sync with localStorage
    const savedState = localStorage.getItem("dashboardSidebarCollapsed");
    setIsCollapsed(savedState === "true");

    const handleStorage = () => {
      const savedState = localStorage.getItem("dashboardSidebarCollapsed");
      setIsCollapsed(savedState === "true");
    };

    window.addEventListener('storage', handleStorage);
    // Custom event for same-tab updates
    window.addEventListener('dashboardSidebarToggle', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('dashboardSidebarToggle', handleStorage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className={`${isCollapsed ? 'ml-20' : 'ml-64'} p-8 transition-all duration-300`}>
        {children}
      </main>
    </div>
  );
}

