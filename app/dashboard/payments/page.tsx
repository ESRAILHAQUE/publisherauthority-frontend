"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { paymentsApi, profileApi } from "@/lib/api";

export default function PaymentsPage() {
  const [paypalEmail, setPaypalEmail] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, invoicesData]: any[] = await Promise.all([
        profileApi.getProfile().catch(() => ({ paypalEmail: "" })),
        paymentsApi.getInvoices().catch(() => []),
      ]);
      setPaypalEmail(profileData.paypalEmail || "");
      setInvoices(
        Array.isArray(invoicesData) ? invoicesData : invoicesData.invoices || []
      );
    } catch (error) {
      console.error("Failed to load payment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaypal = async () => {
    try {
      setSaving(true);
      await paymentsApi.updatePaypalEmail(paypalEmail);
      alert("PayPal email saved successfully");
    } catch (error: any) {
      alert(error.message || "Failed to save PayPal email");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
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
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Payments</h1>
        <p className="text-gray-600">
          Manage your payment settings and view invoice history.
        </p>
      </div>

      {/* Payment Settings */}
      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">
          Payment Settings
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method: PayPal
            </label>
            <Input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="your@paypal.com"
            />
          </div>
          <Button
            onClick={handleSavePaypal}
            isLoading={saving}
            disabled={saving}>
            Save Payment Settings
          </Button>
        </div>
      </Card>

      {/* Payment Information */}
      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-4">
          Payment Information
        </h2>
        <div className="prose max-w-none text-gray-700 space-y-3">
          <p>
            <strong>Key information about your payments.</strong>
          </p>
          <p>
            Payments are sent on the 1st and 15th of each month. If either of
            those days falls on a weekend, the payment will be moved to the next
            business day. Please allow a few business days for the payment to be
            processed.
          </p>
          <p>
            All payments are sent in USD. If you are outside the US, your bank
            may charge you a currency conversion fee.
          </p>
          <p>
            All links are monitored to ensure they remain active. If a link is
            removed, the payment for it will be excluded from the payment cycle.
            If the link is re-added, the payment will be reinstated in the
            cycle. Please note that if a paid link is removed, any future
            payments will also be excluded from the payment cycle until the link
            is restored.
          </p>
        </div>
      </Card>

      {/* Invoice History */}
      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">
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
                    className="py-8 px-4 text-center text-gray-500">
                    Loading invoices...
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
                invoices.map((invoice) => (
                  <tr
                    key={invoice._id || invoice.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {invoice.invoiceNumber || invoice.id}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {invoice.description || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {invoice.invoiceDate
                        ? new Date(invoice.invoiceDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#3F207F]">
                      ${invoice.amount || 0}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {invoice.paymentDate
                        ? new Date(invoice.paymentDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(invoice.status)}>
                        {invoice.status || "Pending"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() =>
                          paymentsApi.downloadInvoice(invoice._id || invoice.id)
                        }
                        className="text-[#3F207F] hover:text-[#2EE6B7] font-medium text-sm transition-colors">
                        Download PDF
                      </button>
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
