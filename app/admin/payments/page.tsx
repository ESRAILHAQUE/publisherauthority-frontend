"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Payment {
  _id?: string;
  id?: string;
  invoiceNumber?: string;
  amount?: number;
  currency?: string;
  dueDate?: string | Date;
  invoiceDate?: string | Date;
  paymentDate?: string | Date;
  status?: "pending" | "processing" | "paid" | "failed";
  paypalEmail?: string;
  publisher?: string;
  userId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    paypalEmail?: string;
  };
  orderIds?: Array<{ _id?: string; orderId?: string; title?: string }>;
  [key: string]: unknown;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    loadPayments();
  }, [statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const filters = statusFilter ? { status: statusFilter } : {};
      const response = (await adminApi.getAllPayments(filters, 1, 100)) as {
        success?: boolean;
        data?: {
          payments?: Payment[];
          [key: string]: unknown;
        };
        payments?: Payment[];
        [key: string]: unknown;
      };

      // Handle different response structures
      let paymentsData: Payment[] = [];
      if (Array.isArray(response)) {
        paymentsData = response;
      } else if (
        response?.data?.payments &&
        Array.isArray(response.data.payments)
      ) {
        paymentsData = response.data.payments;
      } else if (response?.payments && Array.isArray(response.payments)) {
        paymentsData = response.payments;
      }

      setPayments(paymentsData);
    } catch (error) {
      console.error("Failed to load payments:", error);
      toast.error("Failed to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentId: string) => {
    if (!confirm("Process this payment? This will change status to 'Processing'.")) return;

    try {
      await adminApi.processPayment(paymentId);
      toast.success("Payment is now being processed");
      await loadPayments();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process payment";
      toast.error(errorMessage);
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    if (!confirm("Mark this payment as paid? This will finalize the payment.")) return;

    try {
      await adminApi.markPaymentAsPaid(paymentId);
      toast.success("Payment marked as paid successfully");
      await loadPayments();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to mark payment as paid";
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return { variant: "default" as const, label: "Unknown" };
    
    const statusMap: Record<string, { variant: "success" | "warning" | "info" | "danger" | "default"; label: string }> = {
      pending: { variant: "warning", label: "Submitted for Payment" },
      processing: { variant: "info", label: "Processing" },
      paid: { variant: "success", label: "Paid" },
      failed: { variant: "danger", label: "Failed" },
    };

    return statusMap[status.toLowerCase()] || { variant: "default" as const, label: status };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Payment Management
        </h1>
        <p className="text-gray-600">Process and manage all payments to publishers.</p>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-purple focus:border-primary-purple">
          <option value="">All Statuses</option>
          <option value="pending">Submitted for Payment</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Loading payments..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Invoice #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Publisher
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    PayPal Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Orders
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Invoice Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Payment Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-8 px-4 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => {
                  const statusInfo = getStatusBadge(payment.status);
                  return (
                    <tr
                      key={payment._id || payment.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {payment.invoiceNumber || "-"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {payment.userId?.firstName || ""}{" "}
                          {payment.userId?.lastName || ""}
                        </div>
                        {payment.userId?.email && (
                          <div className="text-xs text-gray-500">
                            {payment.userId.email}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {payment.paypalEmail || payment.userId?.paypalEmail || (
                          <span className="text-yellow-600 italic">Not set</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-primary-purple">
                        {payment.currency || "USD"} ${((payment.amount || 0) as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {payment.orderIds && Array.isArray(payment.orderIds) 
                          ? payment.orderIds.length 
                          : 0} order{payment.orderIds && payment.orderIds.length !== 1 ? "s" : ""}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {payment.invoiceDate
                          ? new Date(
                              payment.invoiceDate as string | Date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {payment.dueDate
                          ? new Date(
                              payment.dueDate as string | Date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {payment.paymentDate
                          ? new Date(
                              payment.paymentDate as string | Date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {payment.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const paymentId = payment._id || payment.id;
                                if (paymentId) handleProcessPayment(paymentId);
                              }}>
                              Process
                            </Button>
                          )}
                          {payment.status === "processing" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                const paymentId = payment._id || payment.id;
                                if (paymentId) handleMarkAsPaid(paymentId);
                              }}>
                              Mark as Paid
                            </Button>
                          )}
                          {payment.status === "paid" && (
                            <span className="text-sm text-green-600 font-medium">Completed</span>
                          )}
                        </div>
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
