"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { dashboardApi } from "@/lib/api";

export default function DashboardPage() {
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
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [levelProgress, setLevelProgress] = useState({
    currentLevel: "silver",
    nextLevel: "gold",
    ordersNeeded: 50,
    progressPercentage: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response: any = await dashboardApi.getStats();

      // Handle API response structure: { success: true, data: {...} }
      const data = response?.data || response;

      setStats({
        totalEarnings: data?.stats?.totalEarnings || 0,
        pendingOrders: data?.stats?.orders?.pending || 0,
        readyToPost: data?.stats?.orders?.readyToPost || 0,
        verifying: data?.stats?.orders?.verifying || 0,
        completed: data?.stats?.orders?.completed || 0,
        activeWebsites: data?.stats?.websites?.active || 0,
        accountLevel: data?.user?.accountLevel || "silver",
        ordersForNextLevel: data?.levelProgress?.ordersNeeded || 0,
      });

      setLevelProgress(
        data?.levelProgress || {
          currentLevel: "silver",
          nextLevel: "gold",
          ordersNeeded: 50,
          progressPercentage: 0,
        }
      );
      setRecentOrders(data?.recentOrders || []);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Dashboard</h1>
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
                  className="bg-gradient-to-r from-[#3F207F] to-[#2EE6B7] h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${levelProgress.progressPercentage}%`,
                  }}></div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-[#3F207F]">
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
              <p className="text-2xl font-bold text-[#3F207F]">
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
              <p className="text-2xl font-bold text-[#3F207F]">
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

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-[#3F207F]">
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
                recentOrders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">
                        {order.title || "Untitled Order"}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "success"
                            : order.status === "ready-to-post"
                            ? "info"
                            : order.status === "verifying"
                            ? "warning"
                            : "default"
                        }>
                        {order.status?.replace("-", " ") || "Pending"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.deadline
                        ? new Date(order.deadline).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#3F207F]">
                      ${order.earnings || 0}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={`/dashboard/orders/${order._id || order.id}`}
                        className="text-[#3F207F] hover:text-[#2EE6B7] font-medium transition-colors">
                        View →
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
