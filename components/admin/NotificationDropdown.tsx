"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

interface Notification {
  id: string;
  type: "ticket" | "order" | "payment" | "application" | "website";
  title: string;
  message: string;
  link: string;
  createdAt: string;
  read: boolean;
}

export const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load read state from localStorage
  const getReadNotifications = (): Set<string> => {
    if (typeof window === "undefined") return new Set();
    const stored = localStorage.getItem("admin_notifications_read");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  // Save read state to localStorage
  const markAsRead = (notificationId: string) => {
    const readSet = getReadNotifications();
    readSet.add(notificationId);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_notifications_read", JSON.stringify(Array.from(readSet)));
    }
  };

  useEffect(() => {
    loadNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Fetch dashboard stats to get notification counts
      const dashboardResponse = (await adminApi.getDashboard()) as {
        success?: boolean;
        data?: {
          support?: { openTickets?: number };
          orders?: { active?: number };
          payments?: { pending?: number };
          applications?: { pending?: number };
          websites?: { pending?: number };
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };

      const stats = dashboardResponse?.data || dashboardResponse;
      const readSet = getReadNotifications();
      const notificationList: Notification[] = [];

      // Support Tickets
      if ((stats as any)?.support?.openTickets && ((stats as any).support.openTickets as number) > 0) {
        notificationList.push({
          id: "tickets",
          type: "ticket",
          title: "Open Support Tickets",
          message: `${(stats as any).support.openTickets} open ticket${((stats as any).support.openTickets as number) > 1 ? "s" : ""} need attention`,
          link: "/admin/support",
          createdAt: new Date().toISOString(),
          read: readSet.has("tickets"),
        });
      }

      // Pending Applications
      if ((stats as any)?.applications?.pending && ((stats as any).applications.pending as number) > 0) {
        notificationList.push({
          id: "applications",
          type: "application",
          title: "Pending Applications",
          message: `${(stats as any).applications.pending} application${((stats as any).applications.pending as number) > 1 ? "s" : ""} waiting for review`,
          link: "/admin/applications",
          createdAt: new Date().toISOString(),
          read: readSet.has("applications"),
        });
      }

      // Pending Websites
      if ((stats as any)?.websites?.pending && ((stats as any).websites.pending as number) > 0) {
        notificationList.push({
          id: "websites",
          type: "website",
          title: "Pending Website Verifications",
          message: `${(stats as any).websites.pending} website${((stats as any).websites.pending as number) > 1 ? "s" : ""} waiting for verification`,
          link: "/admin/websites?status=pending",
          createdAt: new Date().toISOString(),
          read: readSet.has("websites"),
        });
      }

      // Active Orders
      if ((stats as any)?.orders?.active && ((stats as any).orders.active as number) > 0) {
        notificationList.push({
          id: "orders",
          type: "order",
          title: "Active Orders",
          message: `${(stats as any).orders.active} active order${((stats as any).orders.active as number) > 1 ? "s" : ""} in progress`,
          link: "/admin/orders",
          createdAt: new Date().toISOString(),
          read: readSet.has("orders"),
        });
      }

      // Pending Payments
      if ((stats as any)?.payments?.pending && ((stats as any).payments.pending as number) > 0) {
        notificationList.push({
          id: "payments",
          type: "payment",
          title: "Pending Payments",
          message: `${(stats as any).payments.pending} payment${((stats as any).payments.pending as number) > 1 ? "s" : ""} waiting to be processed`,
          link: "/admin/payments",
          createdAt: new Date().toISOString(),
          read: readSet.has("payments"),
        });
      }

      setNotifications(notificationList);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    markAsRead(notification.id);
    // Update local state
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    setIsOpen(false);
    router.push(notification.link);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ticket":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        );
      case "order":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case "payment":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "application":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "website":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
        aria-label="Notifications">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 mt-1 ${
                        notification.type === "ticket" ? "text-blue-500" :
                        notification.type === "order" ? "text-purple-500" :
                        notification.type === "payment" ? "text-green-500" :
                        notification.type === "application" ? "text-yellow-500" :
                        "text-gray-500"
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => {
                  router.push("/admin");
                  setIsOpen(false);
                }}
                className="w-full text-center text-sm text-primary-purple hover:text-primary-purple-light font-medium py-2">
                View All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

