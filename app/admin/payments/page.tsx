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
  const [publisherStats, setPublisherStats] = useState<
    Record<
      string,
      {
        awaitingPayout?: number;
        paidAmount?: number;
        completedEarnings?: number;
      }
    >
  >({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"pay" | "history">("pay");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    loadPayments();
    loadPublishers();
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
      // We always show publishers tab, so keep publishers list loaded separately
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

      // Fetch per-publisher payment stats to show awaiting payout and paid totals
      const statsEntries = await Promise.all(
        list
          .filter((p: PublisherSummary) => p?._id)
          .map(async (p: PublisherSummary) => {
            try {
              const statsResp = (await adminApi.getUserPaymentStats(p!._id!)) as any;
              const stats = (statsResp?.data || statsResp || {}) as {
                awaitingPayout?: number;
                paidAmount?: number;
                completedEarnings?: number;
              };
              return [
                p!._id!,
                {
                  awaitingPayout: stats.awaitingPayout ?? 0,
                  paidAmount: stats.paidAmount ?? 0,
                  completedEarnings: stats.completedEarnings ?? 0,
                },
              ] as const;
            } catch (err) {
              console.error("Failed to load stats for publisher", p?._id, err);
              return [p!._id!, { awaitingPayout: 0, paidAmount: 0, completedEarnings: 0 }] as const;
            }
          })
      );
      setPublisherStats(Object.fromEntries(statsEntries));
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

  const handleManualPay = async (payment: Payment) => {
    const paymentId = payment._id || payment.id;
    if (!paymentId) {
      toast.error("Payment ID is missing");
      return;
    }
    const defaultAmount = payment.amount || 0;
    const input = window.prompt(
      "Enter amount to mark as paid:",
      defaultAmount ? String(defaultAmount) : ""
    );
    if (input === null) return; // cancelled
    const amount = parseFloat(input);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      await adminApi.manualPay(paymentId, amount);
      toast.success("Payment marked as paid");
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-1">
            Payment Management
          </h1>
          <p className="text-gray-600">Pay publishers and see payment history.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              className={`px-4 py-2 text-sm font-semibold ${activeTab === "pay" ? "bg-primary-purple text-white" : "bg-white text-gray-700"}`}
              onClick={() => setActiveTab("pay")}>
              Pay Publishers
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold ${activeTab === "history" ? "bg-primary-purple text-white" : "bg-white text-gray-700"}`}
              onClick={() => setActiveTab("history")}>
              Payment History
            </button>
          </div>
          {/* Status Filter (for history) */}
          {activeTab === "history" && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-purple focus:border-primary-purple bg-white">
                <option value="">All</option>
                <option value="pending">Submitted</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" text="Loading payments..." />
        </div>
      )}

      {!loading && activeTab === "pay" && (
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pay Publishers</h2>
            <p className="text-sm text-gray-600">
              Select a publisher and enter an amount to create and mark a payment as paid.
            </p>
          </div>
          {loadingPublishers ? (
            <div className="flex items-center justify-center py-16">
              <Loader size="md" text="Loading publishers..." />
            </div>
          ) : publishers.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No publishers found.</div>
          ) : (
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
                        Total Earned
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Awaiting Payout
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Paid Total
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                </thead>
                <tbody>
                  {publishers.map((p) => {
                    const name =
                      `${p.firstName || ""} ${p.lastName || ""}`.trim() ||
                      p.email ||
                      "-";
                    const stats = p._id ? publisherStats[p._id] : undefined;
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
                        <td className="py-3 px-4 font-semibold text-primary-purple">
                          ${(p.totalEarnings || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-700">
                          ${((stats?.awaitingPayout ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          ${((stats?.paidAmount ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              if (!p._id) {
                                toast.error("User ID missing for this publisher");
                                return;
                              }
                              const input = window.prompt(
                                "Enter amount to pay this publisher:",
                                p.totalEarnings ? String(p.totalEarnings) : ""
                              );
                              if (input === null) return;
                              const amount = parseFloat(input);
                              if (Number.isNaN(amount) || amount <= 0) {
                                toast.error("Please enter a valid amount");
                                return;
                              }
                              adminApi
                                .manualPayCreate({
                                  userId: p._id,
                                  amount,
                                  paymentMethod: p.paymentMethod,
                                  paypalEmail: p.paypalEmail,
                                })
                                .then(() => {
                                  toast.success("Paid and emailed user");
                                  loadPayments();
                                })
                                .catch((err: any) => {
                                  const message =
                                    err?.message ||
                                    err?.response?.data?.message ||
                                    "Failed to pay this publisher";
                                  toast.error(message);
                                });
                            }}>
                            Pay now
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {!loading && activeTab === "history" && (
        payments.length === 0 ? (
          <Card>
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
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Invoice #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Publisher</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Invoice Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Paid Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => {
                    const statusInfo = getStatusBadge(payment.status);
                    const amount = ((payment.amount || 0) as number).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    });
                    return (
                      <tr key={payment._id || payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {payment.invoiceNumber || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {payment.userId?.firstName || ""} {payment.userId?.lastName || ""}
                          {payment.userId?.email && (
                            <div className="text-xs text-gray-500">{payment.userId.email}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {payment.currency || "USD"} ${amount}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={statusInfo.variant} className="text-xs">
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {payment.invoiceDate
                            ? new Date(payment.invoiceDate as string | Date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {payment.paymentDate
                            ? new Date(payment.paymentDate as string | Date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}>
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedPayment && (
              <Card className="border border-gray-200 shadow-sm">
                {(() => {
                  const payment = selectedPayment;
                  const statusInfo = getStatusBadge(payment.status);
                  const paypalEmail = payment.paypalEmail || payment.userId?.paypalEmail;
                  const paymentMethod = payment.paymentMethod || payment.userId?.paymentMethod || "PayPal";
                  const amount = ((payment.amount || 0) as number).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  return (
                    <div className="space-y-4">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Publisher
                          </p>
                          <p className="text-base font-semibold text-gray-900">
                            {payment.userId?.firstName || ""} {payment.userId?.lastName || ""}
                          </p>
                          {payment.userId?.email && (
                            <p className="text-sm text-gray-600">{payment.userId.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Payment Method
                          </p>
                          <p className="text-base font-semibold text-gray-900">{paymentMethod}</p>
                          <p className="text-xs text-gray-600">Payment Email (from profile)</p>
                          <p className="text-sm font-semibold text-gray-800 break-all">
                            {paypalEmail || "Not set"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Amount
                          </p>
                          <p className="text-2xl font-bold text-primary-purple">
                            {payment.currency || "USD"} ${amount}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Invoice Date
                          </p>
                          <p className="text-sm text-gray-800">
                            {payment.invoiceDate
                              ? new Date(payment.invoiceDate as string | Date).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Paid Date
                          </p>
                          <p className="text-sm text-gray-800">
                            {payment.paymentDate
                              ? new Date(payment.paymentDate as string | Date).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Orders:</span>
                        <span className="font-medium text-gray-900">
                          {payment.orderIds && Array.isArray(payment.orderIds)
                            ? payment.orderIds.length
                            : 0}{" "}
                          order{payment.orderIds && payment.orderIds.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        {(payment.status === "pending" || payment.status === "processing") && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleManualPay(payment)}>
                            Manual Pay
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
                      </div>
                    </div>
                  );
                })()}
              </Card>
            )}
          </div>
      )
    )}
    </div>
  );
}
