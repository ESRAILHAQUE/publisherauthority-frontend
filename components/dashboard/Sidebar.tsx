"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const DashboardSidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Load collapsed state from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("dashboardSidebarCollapsed");
      return savedState === "true";
    }
    return false;
  });

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dashboardSidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useDashboardSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardSidebar must be used within a DashboardSidebarProvider"
    );
  }
  return context;
};

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Add Website",
    href: "/dashboard/websites/add",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
  },
  {
    name: "My Websites",
    href: "/dashboard/websites",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
        />
      </svg>
    ),
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useDashboardSidebar();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("dashboardSidebarToggle"));
  };

  // Load logged-in user's email to show beside logout
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = (await authApi.getMe()) as {
          data?: { user?: { email?: string; firstName?: string; lastName?: string } };
          user?: { email?: string; firstName?: string; lastName?: string };
          [key: string]: unknown;
        };
        const user = response.data?.user || response.user;
        if (user?.email) {
          setUserEmail(user.email);
        }
        if (user?.firstName || user?.lastName) {
          const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
          if (name) setUserName(name);
        }
      } catch (error) {
        // Ignore errors; keep UI functional
        console.error("Failed to load user email for sidebar:", error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("authToken");
      localStorage.removeItem("rememberMe");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: unknown) {
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("rememberMe");
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto flex flex-col transition-all duration-300`}>
      <div
        className={`p-6 border-b border-gray-200 ${isCollapsed ? "px-4" : ""}`}>
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-2"
            }`}>
            {!isCollapsed && (
              <span className="text-xl font-bold text-primary-purple whitespace-nowrap">
                Dashboard
              </span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-sm hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Toggle sidebar">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {isCollapsed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav className={`p-4 space-y-2 flex-1 ${isCollapsed ? "px-2" : ""}`}>
        {menuItems.map((item) => {
          // Check if current page matches the menu item
          // For /dashboard, only match exact /dashboard or /dashboard/
          // For other pages like /dashboard/websites, don't match /dashboard/websites/add
          let isActive = false;

          if (item.href === "/dashboard") {
            // Dashboard should only be active on exact /dashboard page
            isActive = pathname === "/dashboard" || pathname === "/dashboard/";
          } else if (item.href === "/dashboard/websites/add") {
            // Add Website should match exact or child routes
            isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
          } else if (item.href === "/dashboard/websites") {
            // My Websites should only match exact, not /dashboard/websites/add
            isActive =
              pathname === "/dashboard/websites" ||
              pathname === "/dashboard/websites/";
          } else {
            // For other pages, match exact or child routes
            isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } ${
                isCollapsed ? "px-2" : "px-4"
              } py-3 rounded-sm transition-colors
                ${
                  isActive
                    ? "bg-primary-purple text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
              title={isCollapsed ? item.name : undefined}>
              {item.icon}
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className={`p-4 border-t border-gray-200 bg-white space-y-2 ${
          isCollapsed ? "px-2" : ""
        }`}>
        {!isCollapsed && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-600 truncate">
              {userName || userEmail || "Loading..."}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-sm text-white bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
              title="Logout">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}

        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-2 py-2 rounded-sm text-white bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium shadow-md hover:shadow-lg"
            title="Logout">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        )}

        <Link
          href="/"
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          } ${
            isCollapsed ? "px-2" : "px-4"
          } py-3 rounded-sm text-gray-700 hover:bg-gray-100 transition-colors`}
          title={isCollapsed ? "Back to Home" : undefined}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {!isCollapsed && (
            <span className="font-medium whitespace-nowrap">Back to Home</span>
          )}
        </Link>
      </div>
    </aside>
  );
};
