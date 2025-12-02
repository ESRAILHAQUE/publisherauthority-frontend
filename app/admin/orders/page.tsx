"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { adminApi, ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  title?: string;
  status?: string;
  deadline?: string | Date;
  earnings?: number;
  amount?: number;
  publisherId?: {
    firstName?: string;
    lastName?: string;
  };
  publisher?: string;
  [key: string]: unknown;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = (await adminApi.getAllOrders()) as
        | Order[]
        | { orders?: Order[]; [key: string]: unknown };
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRevision = async (orderId: string) => {
    const reason = prompt("Enter revision reason:");
    if (!reason) return;

    try {
      await ordersApi.requestRevision(orderId, reason);
      toast.success("Revision requested successfully");
      await loadOrders();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request revision";
      toast.error(errorMessage);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      await ordersApi.cancelOrder(orderId, reason);
      toast.success("Order cancelled successfully");
      await loadOrders();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel order";
      toast.error(errorMessage);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    if (!confirm("Mark this order as completed?")) return;

    try {
      await ordersApi.completeOrder(orderId);
      toast.success("Order marked as completed");
      await loadOrders();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to complete order";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3F207F] mb-2">
            Orders Management
          </h1>
          <p className="text-gray-600">Create and manage all orders.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/admin/orders/create")}>
          Create New Order
        </Button>
      </div>

      <Card>
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
                  Publisher
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
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
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
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {order.title || "Untitled Order"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.publisherId?.firstName || order.publisher || "-"}{" "}
                      {order.publisherId?.lastName || ""}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "success"
                            : order.status === "verifying"
                            ? "warning"
                            : order.status === "ready-to-post"
                            ? "info"
                            : "default"
                        }>
                        {order.status
                          ?.replace("-", " ")
                          .replace(/\b\w/g, (l: string) => l.toUpperCase()) ||
                          "Pending"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.deadline
                        ? new Date(
                            order.deadline as string | Date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#3F207F]">
                      ${order.earnings || order.amount || 0}
                    </td>
                    <td className="py-4 px-4 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setShowActions(
                            showActions === order._id
                              ? null
                              : order._id || order.id || null
                          )
                        }>
                        Manage
                      </Button>
                      {showActions === (order._id || order.id) && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                router.push(
                                  `/admin/orders/${order._id || order.id}`
                                );
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              View Details
                            </button>
                            {order.status === "verifying" && (
                              <>
                                <button
                                  onClick={() => {
                                    const orderId = order._id || order.id;
                                    if (orderId) {
                                      handleRequestRevision(orderId);
                                      setShowActions(null);
                                    }
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50">
                                  Request Revision
                                </button>
                                <button
                                  onClick={() => {
                                    const orderId = order._id || order.id;
                                    if (orderId) {
                                      handleCompleteOrder(orderId);
                                      setShowActions(null);
                                    }
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                  Mark Complete
                                </button>
                              </>
                            )}
                            {order.status !== "completed" &&
                              order.status !== "cancelled" && (
                                <button
                                  onClick={() => {
                                    const orderId = order._id || order.id;
                                    if (orderId) {
                                      handleCancelOrder(orderId);
                                      setShowActions(null);
                                    }
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                  Cancel Order
                                </button>
                              )}
                          </div>
                        </div>
                      )}
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
