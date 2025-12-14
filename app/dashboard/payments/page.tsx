"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { Loader } from "@/components/shared/Loader";
import { Select } from "@/components/shared/Select";
import { paymentsApi, profileApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [invoices, setInvoices] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentStats, setPaymentStats] = useState<{
    totalPayments?: number;
    pendingPayments?: number;
    paidPayments?: number;
    totalAmount?: number;
    pendingAmount?: number;
    paidAmount?: number;
    completedOrders?: number;
    completedEarnings?: number;
    awaitingPayout?: number;
  }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, invoicesData, statsData] = await Promise.all([
        profileApi.getProfile().catch(() => ({ paypalEmail: "" })),
        paymentsApi.getInvoices().catch(() => []),
        paymentsApi.getPaymentStats().catch(() => ({})),
      ]);
      
      // Handle profile data - Backend returns { success: true, data: { user: {...} } }
      let paypalEmailValue = "";
      let paymentMethodValue = "PayPal";
      if (profileData) {
        const profile = profileData as {
          success?: boolean;
          data?: {
            user?: { paypalEmail?: string; paymentMethod?: string };
            paypalEmail?: string;
            paymentMethod?: string;
            [key: string]: unknown;
          };
          user?: { paypalEmail?: string; paymentMethod?: string };
          paypalEmail?: string;
          paymentMethod?: string;
          [key: string]: unknown;
        };
        
        // Backend format: { success: true, data: { user: { paypalEmail: "...", paymentMethod: "..." } } }
        paypalEmailValue = 
          profile?.data?.user?.paypalEmail ||
          profile?.data?.paypalEmail ||
          profile?.user?.paypalEmail ||
          profile?.paypalEmail ||
          "";
        
        paymentMethodValue = 
          profile?.data?.user?.paymentMethod ||
          profile?.data?.paymentMethod ||
          profile?.user?.paymentMethod ||
          profile?.paymentMethod ||
          "PayPal";
      }
      
      // Always update state to ensure latest data is shown
      setPaypalEmail(paypalEmailValue);
      setPaymentMethod(paymentMethodValue);
      if (paypalEmailValue) {
        setOriginalPaypalEmail(paypalEmailValue);
      }
      
      // Handle invoices data - Backend returns { success: true, data: { payments: [...], total, page, pages } }
      let invoicesArray: Record<string, unknown>[] = [];
      if (invoicesData) {
        const invoices = invoicesData as {
          success?: boolean;
          data?: {
            payments?: Record<string, unknown>[];
            invoices?: Record<string, unknown>[];
            total?: number;
            page?: number;
            pages?: number;
            [key: string]: unknown;
          };
          payments?: Record<string, unknown>[];
          invoices?: Record<string, unknown>[];
          [key: string]: unknown;
        };
        
        // Backend format: { success: true, data: { payments: [...], total, page, pages } }
        invoicesArray = 
          (Array.isArray(invoicesData) ? invoicesData : []) ||
          invoices?.data?.payments ||
          invoices?.data?.invoices ||
          invoices?.payments ||
          invoices?.invoices ||
          [];
      }
      setInvoices(invoicesArray);
      
      // Set payment stats - handle different response structures
      const stats = statsData as {
        data?: {
          totalPayments?: number;
          pendingPayments?: number;
          paidPayments?: number;
          totalAmount?: number;
          pendingAmount?: number;
          paidAmount?: number;
          awaitingPayout?: number;
          completedOrders?: number;
          completedEarnings?: number;
        };
        totalPayments?: number;
        pendingPayments?: number;
        paidPayments?: number;
        totalAmount?: number;
        pendingAmount?: number;
        paidAmount?: number;
        awaitingPayout?: number;
        completedOrders?: number;
        completedEarnings?: number;
        };
      setPaymentStats(stats?.data || stats || {});
      
      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Payment data loaded:', {
          paypalEmail: paypalEmailValue,
          invoicesCount: invoicesArray.length,
          stats: stats?.data || stats,
        });
      }
    } catch (error) {
      console.error("Failed to load payment data:", error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [originalPaypalEmail, setOriginalPaypalEmail] = useState("");

  useEffect(() => {
    if (paypalEmail) {
      setOriginalPaypalEmail(paypalEmail);
    }
  }, [paypalEmail]);

  const handleCancelEdit = () => {
    setPaypalEmail(originalPaypalEmail);
    setIsEditing(false);
  };

  const handleSavePaypal = async () => {
    if (!paypalEmail || paypalEmail.trim() === "") {
      toast.error("Please enter a valid PayPal email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setSaving(true);
      const response = await paymentsApi.updatePaypalEmail(paypalEmail.trim(), paymentMethod);
      
      // Handle response - Backend returns { success: true, data: { user: { paypalEmail: "...", paymentMethod: "..." } } }
      const responseData = response as {
        success?: boolean;
        data?: {
          user?: { paypalEmail?: string; paymentMethod?: string };
          paypalEmail?: string;
          paymentMethod?: string;
          [key: string]: unknown;
        };
        user?: { paypalEmail?: string; paymentMethod?: string };
        paypalEmail?: string;
        paymentMethod?: string;
        [key: string]: unknown;
      };
      
      // Update PayPal email from response
      const updatedEmail = 
        responseData?.data?.user?.paypalEmail ||
        responseData?.data?.paypalEmail ||
        responseData?.user?.paypalEmail ||
        responseData?.paypalEmail ||
        paypalEmail.trim();
      
      const updatedPaymentMethod = 
        responseData?.data?.user?.paymentMethod ||
        responseData?.data?.paymentMethod ||
        responseData?.user?.paymentMethod ||
        responseData?.paymentMethod ||
        paymentMethod;
      
      // Update state immediately
      setPaypalEmail(updatedEmail);
      setPaymentMethod(updatedPaymentMethod);
      setOriginalPaypalEmail(updatedEmail);
      setIsEditing(false);
      
      toast.success("Payment settings saved successfully");
      
      // Reload all data to ensure consistency with database
      // Use setTimeout to ensure state updates are processed first
      setTimeout(async () => {
        await loadData();
      }, 500);
    } catch (error: unknown) {
      console.error("Save payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save payment settings";
      toast.error(errorMessage);
      // Revert to original email on error
      if (originalPaypalEmail) {
        setPaypalEmail(originalPaypalEmail);
      }
    } finally {
      setSaving(false);
    }
  };

  const awaitingPayout =
    paymentStats.awaitingPayout ??
    Math.max(
      (paymentStats.completedEarnings || 0) - (paymentStats.paidAmount || 0),
      0
    );
  const totalEarned = paymentStats.paidAmount ?? 0;

  const getStatusBadge = (status?: string) => {
    if (!status) return "default";
    const variants: Record<
      string,
      "success" | "warning" | "info" | "danger" | "default"
    > = {
      Paid: "success",
      Pending: "warning",
      Processing: "info",
      Failed: "danger",
    };
    return variants[status] || "default";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Payments
        </h1>
        <p className="text-gray-600">
          Manage your payment settings and view invoice history.
        </p>
      </div>

      {/* Payout Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Awaiting Payout</h3>
          <p className="text-3xl font-bold text-primary-purple">
            ${(awaitingPayout || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Completed orders not paid yet</p>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-primary-purple">
            ${(totalEarned || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">All earnings already paid out</p>
        </Card>
      </div>

      {/* Payment Information - Combined View & Edit */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary-purple">
            Payment Information
          </h2>
        </div>
        <div className="prose max-w-none text-gray-700 space-y-4">
          {/* Display Saved Payment Details from Database */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Your Payment Information</h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}>
                  {paypalEmail ? "Edit Payment Info" : "Add Payment Info"}
                </Button>
              )}
            </div>

            {!isEditing ? (
              // View Mode
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="text-lg font-semibold text-gray-900">{paymentMethod || "PayPal"}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">PayPal Email</p>
                    {paypalEmail ? (
                      <p className="text-lg font-semibold text-primary-purple break-all">{paypalEmail}</p>
                    ) : (
                      <p className="text-sm text-yellow-600 italic">Not set - Click Edit to add</p>
                    )}
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Currency</p>
                    <p className="text-lg font-semibold text-gray-900">USD</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Payment Schedule</p>
                    <p className="text-lg font-semibold text-gray-900">1st & 15th of each month</p>
                  </div>
                </div>
                
              </>
            ) : (
              // Edit Mode - Inline editing
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      options={[
                        { value: "PayPal", label: "PayPal" },
                        { value: "Bank Transfer", label: "Bank Transfer" },
                        { value: "Wise", label: "Wise" },
                        { value: "Payoneer", label: "Payoneer" },
                        { value: "Other", label: "Other" },
                      ]}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Select your preferred payment method
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PayPal Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="your@paypal.com"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the PayPal email address where you want to receive payments
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Currency</p>
                    <p className="text-lg font-semibold text-gray-900">USD</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Payment Schedule</p>
                    <p className="text-lg font-semibold text-gray-900">1st & 15th of each month</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleSavePaypal}
                    isLoading={saving}
                    disabled={saving || !paypalEmail}>
                    {paypalEmail && originalPaypalEmail ? "Update Payment Info" : "Save Payment Info"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Policy Information */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="font-semibold text-blue-900 mb-2">
              Payment Policy Information
            </p>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>
                Payments are sent on the <strong>1st and 15th</strong> of each month. 
                If either of those days falls on a weekend, the payment will be moved to the next business day.
              </li>
              <li>
                Please allow a few business days for the payment to be processed.
              </li>
              <li>
                All payments are sent in <strong>USD</strong>. If you are outside the US, 
                your bank may charge you a currency conversion fee.
              </li>
              <li>
                All links are monitored to ensure they remain active. If a link is removed, 
                the payment for it will be excluded from the payment cycle.
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Invoice History */}
      <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          Invoice History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Invoice #
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Invoice Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Amount
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 px-4 text-center">
                    <div className="flex items-center justify-center py-12">
                      <Loader size="md" text="Loading invoices..." />
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 px-4 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const invoiceId = invoice._id || invoice.id;
                  const invoiceNumber =
                    typeof invoice.invoiceNumber === "string"
                      ? invoice.invoiceNumber
                      : invoiceId
                      ? String(invoiceId)
                      : "";
                  const invoiceDescription =
                    typeof invoice.description === "string"
                      ? invoice.description
                      : "-";

                  return (
                    <tr
                      key={invoiceId ? String(invoiceId) : undefined}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {invoiceNumber}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {invoiceDescription}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {invoice.invoiceDate
                          ? new Date(
                              invoice.invoiceDate as string | Date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-4 font-semibold text-primary-purple">
                        ${(invoice.amount || 0) as number}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {invoice.dueDate
                          ? new Date(
                              invoice.dueDate as string | Date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {invoice.paymentDate
                          ? new Date(
                              invoice.paymentDate as string | Date
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={getStatusBadge(invoice.status as string)}>
                          {(invoice.status as string) || "Pending"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            if (invoiceId)
                              paymentsApi.downloadInvoice(String(invoiceId));
                          }}
                          className="text-primary-purple hover:text-accent-teal font-medium text-sm transition-colors">
                          Download PDF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
