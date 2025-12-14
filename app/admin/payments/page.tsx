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
  paymentMethod?: string;
  paypalEmail?: string;
  publisher?: string;
  userId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    paypalEmail?: string;
    paymentMethod?: string;
  };
  orderIds?: Array<{ _id?: string; orderId?: string; title?: string }>;
  [key: string]: unknown;
}

interface PublisherSummary {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  paypalEmail?: string;
  paymentMethod?: string;
  totalEarnings?: number;
  completedOrders?: number;
  activeWebsites?: number;
  accountLevel?: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [publishers, setPublishers] = useState<PublisherSummary[]>([]);
  const [loadingPublishers, setLoadingPublishers] = useState(false);
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
          total?: number;
          page?: number;
          pages?: number;
          [key: string]: unknown;
        };
        payments?: Payment[];
        total?: number;
        page?: number;
        pages?: number;
        [key: string]: unknown;
      };

      // Debug logging
      if (process.env.NODE_ENV === "development") {
        console.log("Payments API Response:", response);
        console.log("Response structure:", {
          hasData: !!response?.data,
          hasPayments: !!response?.data?.payments,
          paymentsCount: response?.data?.payments?.length || 0,
          firstPayment: response?.data?.payments?.[0]
        });
      }

      // Handle different response structures
      // Backend returns: { success: true, message: "...", data: { payments: [], total, page, pages } }
      let paymentsData: Payment[] = [];
      
      // Check if response is an array (direct payments array)
      if (Array.isArray(response)) {
        paymentsData = response;
      } 
      // Check for standard backend response format: { success: true, data: { payments: [] } }
      else if (response?.data) {
        if (Array.isArray(response.data.payments)) {
          paymentsData = response.data.payments;
        } else if (Array.isArray(response.data)) {
          paymentsData = response.data;
        }
      } 
      // Check for direct payments property
      else if (response?.payments && Array.isArray(response.payments)) {
        paymentsData = response.payments;
      }
      // Fallback: check if response itself has payment-like structure
      else if (response && typeof response === "object") {
        // Try to find any array property that might be payments
        const possiblePayments = Object.values(response).find(
          (val) => Array.isArray(val) && val.length > 0 && val[0] && typeof val[0] === "object" && ("invoiceNumber" in val[0] || "amount" in val[0])
        );
        if (possiblePayments && Array.isArray(possiblePayments)) {
          paymentsData = possiblePayments as Payment[];
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log("Extracted payments:", paymentsData.length, paymentsData);
        if (paymentsData.length > 0) {
          console.log("First payment fields:", Object.keys(paymentsData[0]));
          console.log("First payment paymentMethod:", paymentsData[0]?.paymentMethod);
          console.log("First payment userId:", paymentsData[0]?.userId);
          console.log("First payment userId.paymentMethod:", paymentsData[0]?.userId?.paymentMethod);
          console.log("First payment userId.paypalEmail:", paymentsData[0]?.userId?.paypalEmail);
        }
      }

      setPayments(paymentsData);

      // If there are no payments yet, show publishers' payout info directly from users collection
      if (paymentsData.length === 0) {
        await loadPublishers();
      } else {
        setPublishers([]);
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
      toast.error("Failed to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPublishers = async () => {
    try {
      setLoadingPublishers(true);
      const response = (await adminApi.getAllPublishers({}, 1, 200)) as {
        success?: boolean;
        data?: { publishers?: PublisherSummary[]; users?: PublisherSummary[] };
        publishers?: PublisherSummary[];
        users?: PublisherSummary[];
        [key: string]: unknown;
      };
      const data = (response as any)?.data || response;
      const list =
        (Array.isArray(data?.publishers) && data.publishers) ||
        (Array.isArray(data?.users) && data.users) ||
        (Array.isArray(response as any) && (response as any)) ||
        [];
      setPublishers(list);
    } catch (error) {
      console.error("Failed to load publishers for payments view:", error);
    } finally {
      setLoadingPublishers(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-2">
            Payment Management
          </h1>
          <p className="text-gray-600">Process and manage all payments to publishers.</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-purple focus:border-primary-purple bg-white">
            <option value="">All Statuses</option>
            <option value="pending">Submitted for Payment</option>
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" text="Loading payments..." />
        </div>
      ) : payments.length === 0 ? (
        <Card>
          {loadingPublishers ? (
            <div className="flex items-center justify-center py-16">
              <Loader size="md" text="Loading publishers..." />
            </div>
          ) : publishers.length === 0 ? (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
              <p className="text-gray-500 text-lg font-medium mb-2">No payments found</p>
              <p className="text-gray-400 text-sm">
                {statusFilter
                  ? `No payments with status "${statusFilter}" found. Try changing the filter.`
                  : "There are no payments to display at this time."}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Publishers (from users collection)
                </h2>
                <p className="text-sm text-gray-600">
                  Payment method and earnings are shown directly from user profiles when no payments exist.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Publisher
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Payment Method
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        PayPal Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Total Earnings
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Completed Orders
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Active Websites
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {publishers.map((p) => {
                      const name =
                        `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                        p.email ||
                        "-";
                      return (
                        <tr
                          key={p._id || p.email}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-900">{name}</div>
                            <div className="text-xs text-gray-600">{p.email}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {p.paymentMethod || "PayPal"}
                          </td>
                          <td className="py-3 px-4 text-gray-700 break-all">
                            {p.paypalEmail || "-"}
                          </td>
                          <td className="py-3 px-4 font-semibold text-primary-purple">
                            ${(p.totalEarnings || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {p.completedOrders ?? 0}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {p.activeWebsites ?? 0}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {payments.map((payment) => {
            const statusInfo = getStatusBadge(payment.status);
            const paypalEmail = payment.paypalEmail || payment.userId?.paypalEmail;
            const paymentMethod = payment.paymentMethod || payment.userId?.paymentMethod || "PayPal";
            const amount = ((payment.amount || 0) as number).toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            });
            
            if (process.env.NODE_ENV === "development") {
              console.log("Payment data:", {
                id: payment._id || payment.id,
                paymentMethod: payment.paymentMethod,
                userIdPaymentMethod: payment.userId?.paymentMethod,
                finalPaymentMethod: paymentMethod,
                paypalEmail: payment.paypalEmail,
                userIdPaypalEmail: payment.userId?.paypalEmail,
                finalPaypalEmail: paypalEmail,
                userId: payment.userId
              });
            }
            
            return (
              <Card key={payment._id || payment.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Invoice #{payment.invoiceNumber || "N/A"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {payment.invoiceDate
                          ? new Date(payment.invoiceDate as string | Date).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <Badge variant={statusInfo.variant} className="text-sm">
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Publisher Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Publisher
                      </label>
                      <div className="mt-1">
                        <p className="text-base font-semibold text-gray-900">
                          {payment.userId?.firstName || ""} {payment.userId?.lastName || ""}
                        </p>
                        {payment.userId?.email && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            {payment.userId.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method & PayPal Email */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                      <div>
                        <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          Payment Method
                        </label>
                        <p className="mt-1 text-base font-semibold text-blue-900">
                          {paymentMethod}
                        </p>
                      </div>
                      <div className="border-t border-blue-200 pt-2">
                        <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          Payment Email (from User Profile)
                        </label>
                        <p className="mt-1 text-base font-medium text-blue-900 break-all">
                          {paypalEmail ? (
                            <span className="font-semibold">{paypalEmail}</span>
                          ) : (
                            <span className="text-yellow-700 italic font-medium">⚠️ Payment email not set by user</span>
                          )}
                        </p>
                        {!paypalEmail && (
                          <p className="text-xs text-yellow-700 mt-1">
                            User needs to add PayPal email in their profile settings
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Amount to Pay
                      </label>
                      <p className="mt-1 text-2xl font-bold text-primary-purple">
                        {payment.currency || "USD"} ${amount}
                      </p>
                    </div>

                    {/* Order Count */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Orders:</span>
                      <span className="font-medium text-gray-900">
                        {payment.orderIds && Array.isArray(payment.orderIds) 
                          ? payment.orderIds.length 
                          : 0} order{payment.orderIds && payment.orderIds.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Due Date
                        </label>
                        <p className="mt-1 text-sm text-gray-700">
                          {payment.dueDate
                            ? new Date(payment.dueDate as string | Date).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                      {payment.paymentDate && (
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Paid Date
                          </label>
                          <p className="mt-1 text-sm text-gray-700">
                            {new Date(payment.paymentDate as string | Date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    {payment.status === "pending" && (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => {
                          const paymentId = payment._id || payment.id;
                          if (paymentId) handleProcessPayment(paymentId);
                        }}>
                        Process Payment
                      </Button>
                    )}
                    {payment.status === "processing" && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 text-center mb-2">
                          Payment is being processed. After completing the payment, mark it as paid.
                        </p>
                        <Button
                          variant="primary"
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            const paymentId = payment._id || payment.id;
                            if (paymentId) handleMarkAsPaid(paymentId);
                          }}>
                          Mark as Paid
                        </Button>
                      </div>
                    )}
                    {payment.status === "paid" && (
                      <div className="text-center py-2">
                        <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Payment Completed
                        </span>
                      </div>
                    )}
                    {payment.status === "failed" && (
                      <div className="text-center py-2">
                        <span className="text-red-600 font-medium">Payment Failed</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
