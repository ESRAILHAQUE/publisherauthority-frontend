"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { ordersApi } from "@/lib/api";

interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  title?: string;
  status?: string;
  deadline?: string | Date;
  earnings?: number;
  amount?: number;
  websiteId?: {
    url?: string;
    [key: string]: unknown;
  };
  website?: string;
  [key: string]: unknown;
}

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = (await ordersApi.getOrders()) as
        | Order[]
        | { 
            success?: boolean;
            data?: { orders?: Order[]; [key: string]: unknown };
            orders?: Order[];
            [key: string]: unknown;
          };
      
      // Handle different response structures
      let ordersData: Order[] = [];
      if (Array.isArray(response)) {
        ordersData = response;
      } else if (response && typeof response === "object") {
        // Backend returns { success: true, data: { orders: [...], total, page, pages } }
        if (response.data && typeof response.data === "object" && "orders" in response.data) {
          ordersData = Array.isArray(response.data.orders) ? response.data.orders : [];
        } else if ("orders" in response && Array.isArray(response.orders)) {
          ordersData = response.orders;
        }
      }
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "all", label: "All Orders", count: orders.length },
    {
      id: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      id: "ready",
      label: "Ready To Post",
      count: orders.filter((o) => o.status === "ready-to-post").length,
    },
    {
      id: "verifying",
      label: "Verifying",
      count: orders.filter((o) => o.status === "verifying").length,
    },
    {
      id: "completed",
      label: "Completed",
      count: orders.filter((o) => o.status === "completed").length,
    },
  ];

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => {
          if (!o.status) return false;
          const status = o.status.toLowerCase().replace(/-/g, "");
          return status === activeTab;
        });

  const getStatusBadge = (status?: string) => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    const variants: Record<
      string,
      "default" | "info" | "warning" | "success" | "danger"
    > = {
      pending: "default",
      "ready-to-post": "info",
      verifying: "warning",
      completed: "success",
      "revision-requested": "warning",
      cancelled: "danger",
    };
    return variants[statusLower] || "default";
  };

  const formatStatus = (status?: string) => {
    if (!status) return "Unknown";
    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all your orders.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 font-medium transition-colors border-b-2
              ${
                activeTab === tab.id
                  ? "border-[#3F207F] text-primary-purple"
                  : "border-transparent text-gray-600 hover:text-primary-purple"
              }
            `}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
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
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Website
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-600">
                      #
                      {order.orderNumber ||
                        (order._id ? order._id.slice(-8) : "") ||
                        order.id ||
                        "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900">
                        {order.title || "Untitled Order"}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.websiteId?.url || order.website || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(order.status)}>
                        {formatStatus(order.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.deadline
                        ? new Date(
                            order.deadline as string | Date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-primary-purple">
                      ${(order.earnings || order.amount || 0) as number}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const orderId = order._id || order.id;
                          if (orderId)
                            router.push(`/dashboard/orders/${orderId}`);
                        }}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </Card>
    </div>
  );
}
