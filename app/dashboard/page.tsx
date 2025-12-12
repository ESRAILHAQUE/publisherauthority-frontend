"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Loader } from "@/components/shared/Loader";
import { dashboardApi, authApi } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingOrders: 0,
    readyToPost: 0,
    verifying: 0,
    completed: 0,
    activeWebsites: 0,
    accountLevel: "Silver",
    ordersForNextLevel: 0,
    counterOffers: 0, // new stat
  });
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>(
    []
  );
  const [levelProgress, setLevelProgress] = useState({
    currentLevel: "silver",
    nextLevel: "gold",
    ordersNeeded: 50,
    progressPercentage: 0,
  });

  useEffect(() => {
    // Check if user is admin and redirect to admin dashboard
    const checkUserRole = async () => {
      try {
        const response = (await authApi.getMe()) as {
          data?: { user?: { role?: string } };
          user?: { role?: string };
          [key: string]: unknown;
        };
        const user = response.data?.user || response.user;
        
        if (user?.role === "admin") {
          router.push("/admin");
          return;
        }
      } catch (error) {
        console.error("Failed to check user role:", error);
      }
    };

    checkUserRole();
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = (await dashboardApi.getStats()) as {
        data?: {
          recentOrders?: Record<string, unknown>[];
          levelProgress?: Record<string, unknown>;
          stats?: Record<string, unknown>;
          user?: Record<string, unknown>;
        };
        recentOrders?: Record<string, unknown>[];
        levelProgress?: Record<string, unknown>;
        stats?: Record<string, unknown>;
        user?: Record<string, unknown>;
        [key: string]: unknown;
      };

      // Handle API response structure: { success: true, data: {...} }
      const data = response?.data || response;

      const statsData = data?.stats as Record<string, unknown> | undefined;
      const ordersData = statsData?.orders as
        | Record<string, unknown>
        | undefined;
      const websitesData = statsData?.websites as
        | Record<string, unknown>
        | undefined;
      const userData = (data as { user?: Record<string, unknown> })?.user as
        | Record<string, unknown>
        | undefined;
      const levelProgressData = data?.levelProgress as
        | {
          currentLevel?: string;
          nextLevel?: string;
          ordersNeeded?: number;
          progressPercentage?: number;
        }
        | undefined;

      // Extract all stats from database response
      setStats({
        totalEarnings:
          typeof statsData?.totalEarnings === "number"
            ? (statsData.totalEarnings as number)
            : 0,
        pendingOrders:
          typeof ordersData?.pending === "number" ? (ordersData.pending as number) : 0,
        readyToPost:
          typeof ordersData?.readyToPost === "number"
            ? (ordersData.readyToPost as number)
            : 0,
        verifying:
          typeof ordersData?.verifying === "number" ? (ordersData.verifying as number) : 0,
        completed:
          typeof ordersData?.completed === "number" ? (ordersData.completed as number) : 0,
        activeWebsites:
          typeof websitesData?.active === "number" ? (websitesData.active as number) : 0,
        accountLevel:
          typeof userData?.accountLevel === "string"
            ? (userData.accountLevel as string)
            : "silver",
        ordersForNextLevel:
          typeof levelProgressData?.ordersNeeded === "number"
            ? (levelProgressData.ordersNeeded as number)
            : 0,
        counterOffers:
          // Try multiple possible locations for counter offers count
          typeof ordersData?.counterOffers === "number"
            ? (ordersData.counterOffers as number)
            : typeof statsData?.counterOffers === "number"
              ? (statsData.counterOffers as number)
              : typeof websitesData?.counterOffers === "number"
                ? (websitesData.counterOffers as number)
                : 0,
      });

      setLevelProgress({
        currentLevel:
          typeof levelProgressData?.currentLevel === "string"
            ? levelProgressData.currentLevel
            : "silver",
        nextLevel:
          typeof levelProgressData?.nextLevel === "string"
            ? levelProgressData.nextLevel
            : "gold",
        ordersNeeded:
          typeof levelProgressData?.ordersNeeded === "number"
            ? levelProgressData.ordersNeeded
            : 50,
        progressPercentage:
          typeof levelProgressData?.progressPercentage === "number"
            ? levelProgressData.progressPercentage
            : 0,
      });
      // Set recent orders - ensure it's an array
      const orders = Array.isArray(data?.recentOrders) 
        ? data.recentOrders 
        : Array.isArray(response?.recentOrders)
          ? response.recentOrders
          : [];
      setRecentOrders(orders);

      // Log for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Dashboard data loaded:', {
          stats: statsData,
          orders: ordersData,
          websites: websitesData,
          user: userData,
          levelProgress: levelProgressData,
          recentOrders: orders.length,
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Set empty states on error
      setStats({
        totalEarnings: 0,
        pendingOrders: 0,
        readyToPost: 0,
        verifying: 0,
        completed: 0,
        activeWebsites: 0,
        accountLevel: "silver",
        ordersForNextLevel: 0,
        counterOffers: 0,
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    const levelLower = level.toLowerCase();
    switch (levelLower) {
      case "silver":
        return "default";
      case "gold":
        return "warning";
      case "premium":
        return "purple";
      default:
        return "default";
    }
  };

  const formatLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s your overview.
        </p>
      </div>

      {/* Account Level Badge */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Account Level
            </h2>
            <Badge
              variant={
                getLevelBadgeColor(stats.accountLevel) as
                | "default"
                | "warning"
                | "purple"
              }
              size="md"
              className="text-lg px-4 py-2">
              {formatLevel(stats.accountLevel)}
            </Badge>
            {levelProgress.currentLevel !== "premium" && (
              <p className="text-sm text-gray-600 mt-2">
                {levelProgress.ordersNeeded} more completed orders to reach{" "}
                {formatLevel(levelProgress.nextLevel)} level
              </p>
            )}
          </div>
          {levelProgress.currentLevel !== "premium" && (
            <div className="flex-1 max-w-md ml-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to next level</span>
                <span>{levelProgress.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-primary-purple to-accent-teal h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${levelProgress.progressPercentage}%`,
                  }}></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-primary-purple">
                ${stats.totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-primary-purple">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ready To Post</p>
              <p className="text-2xl font-bold text-primary-purple">
                {stats.readyToPost}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* New Counter Offers Card */}
        <div
          onClick={() => router.push("/dashboard/websites?filter=counter-offer")}
          className="cursor-pointer"
        >
          <Card hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Counter Offers</p>
                <p className="text-2xl font-bold text-primary-purple">
                  {stats.counterOffers}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h6m2 8l4-4-4-4M3 4v16a1 1 0 001 1h4"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-primary-purple">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Orders
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Loading orders..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Earnings
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 px-4 text-center text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => {
                    // Get order ID - MongoDB _id or orderId field
                    const orderId = (order as any)._id || (order as any).id || (order as any).orderId;
                    const orderTitle =
                      typeof (order as any).title === "string"
                        ? (order as any).title
                        : "Untitled Order";
                    const orderStatus =
                      typeof (order as any).status === "string" ? (order as any).status : undefined;
                    const orderDeadline = (order as any).deadline;
                    const orderEarnings =
                      typeof (order as any).earnings === "number" ? (order as any).earnings : 0;

                    return (
                      <tr
                        key={orderId ? String(orderId) : undefined}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">
                            {orderTitle}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              orderStatus === "completed"
                                ? "success"
                                : orderStatus === "ready-to-post"
                                  ? "info"
                                  : orderStatus === "verifying"
                                    ? "warning"
                                    : "default"
                            }>
                            {orderStatus
                              ? orderStatus.replace("-", " ")
                              : "Pending"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {orderDeadline &&
                            (typeof orderDeadline === "string" ||
                              orderDeadline instanceof Date)
                            ? new Date(orderDeadline as any).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="py-4 px-4 font-semibold text-primary-purple">
                          ${orderEarnings}
                        </td>
                        <td className="py-4 px-4">
                          <a
                            href={`/dashboard/orders/${orderId || ""}`}
                            className="text-primary-purple hover:text-accent-teal font-medium transition-colors">
                            View →
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}