"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Loader } from "@/components/shared/Loader";
import { ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    articleUrl: "",
    notes: "",
  });

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = (await ordersApi.getOrder(orderId)) as Record<
        string,
        unknown
      >;
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionData.articleUrl) {
      toast.error("Please provide the article URL");
      return;
    }

    try {
      setSubmitting(true);
      await ordersApi.submitOrder(orderId, {
        submissionUrl: submissionData.articleUrl,
        submissionNotes: submissionData.notes,
      });
      toast.success("Order submitted successfully!");
      await loadOrder();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit order";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!order && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Button
          onClick={() => router.push("/dashboard/orders")}
          className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const orderStatus = order ? String(order.status || "") : "";
  const canSubmit =
    orderStatus === "ready-to-post" || orderStatus === "pending";
  const isCompleted = orderStatus === "completed";
  const isVerifying = orderStatus === "verifying";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/orders")}>
            ← Back to Orders
          </Button>
          {loading ? (
            <div className="mt-4">
              <Loader size="md" text="Loading order..." />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-primary-purple mt-4 mb-2">
                Order #
                {String(
                  order?.orderNumber ||
                    (order?._id ? String(order._id).slice(-8) : "") ||
                    order?.id ||
                    "N/A"
                )}
              </h1>
              <p className="text-gray-600">
                {String(order?.title || "Untitled Order")}
              </p>
            </>
          )}
        </div>
        {!loading && order && (
          <Badge
            variant={
              orderStatus === "completed"
                ? "success"
                : orderStatus === "ready-to-post"
                ? "info"
                : orderStatus === "verifying"
                ? "warning"
                : "default"
            }
            size="md">
            {order.status
              ? String(order.status)
                  .replace("-", " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())
              : "Unknown"}
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader size="lg" text="Loading order details..." />
        </div>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-primary-purple mb-4">
              Order Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-medium">{String(order.title || "N/A")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Website</p>
                <p className="font-medium">
                  {(order.websiteId as { url?: string })?.url ||
                    String(order.website || "-")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-medium">
                  {order.deadline
                    ? new Date(
                        order.deadline as string | Date
                      ).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="font-semibold text-primary-purple text-lg">
                  ${(order.earnings || order.amount || 0) as number}
                </p>
              </div>
              {order.description ? (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-700">
                    {typeof order.description === "string"
                      ? order.description
                      : String(order.description || "")}
                  </p>
                </div>
              ) : null}
              {order.requirements ? (
                <div>
                  <p className="text-sm text-gray-600">Requirements</p>
                  <div className="text-gray-700 whitespace-pre-line">
                    {typeof order.requirements === "string"
                      ? order.requirements
                      : String(order.requirements || "")}
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          {/* Submission Form */}
          {canSubmit && !isCompleted && (
            <Card>
              <h2 className="text-xl font-semibold text-primary-purple mb-4">
                Submit Order
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Article URL"
                  type="url"
                  value={submissionData.articleUrl}
                  onChange={(e) =>
                    setSubmissionData({
                      ...submissionData,
                      articleUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/article"
                  required
                />
                <Textarea
                  label="Notes (Optional)"
                  value={submissionData.notes}
                  onChange={(e) =>
                    setSubmissionData({
                      ...submissionData,
                      notes: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Any additional notes..."
                />
                <Button
                  type="submit"
                  isLoading={submitting}
                  disabled={submitting}>
                  Submit Order
                </Button>
              </form>
            </Card>
          )}

          {/* Submission Info */}
          {isVerifying || isCompleted ? (
            <Card>
              <h2 className="text-xl font-semibold text-primary-purple mb-4">
                Submission Details
              </h2>
              {order.submittedUrl ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Article URL</p>
                    <a
                      href={
                        typeof order.submittedUrl === "string"
                          ? order.submittedUrl
                          : String(order.submittedUrl || "")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-purple hover:underline">
                      {typeof order.submittedUrl === "string"
                        ? order.submittedUrl
                        : String(order.submittedUrl || "")}
                    </a>
                  </div>
                  {order.submittedAt ? (
                    <div>
                      <p className="text-sm text-gray-600">Submitted At</p>
                      <p className="text-gray-700">
                        {(() => {
                          const submittedAt =
                            typeof order.submittedAt === "string" ||
                            order.submittedAt instanceof Date
                              ? order.submittedAt
                              : typeof order.submittedAt === "number"
                              ? new Date(order.submittedAt)
                              : null;
                          return submittedAt
                            ? new Date(submittedAt).toLocaleString()
                            : "-";
                        })()}
                      </p>
                    </div>
                  ) : null}
                  {order.submissionNotes ? (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-700">
                        {typeof order.submissionNotes === "string"
                          ? order.submissionNotes
                          : String(order.submissionNotes || "")}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </Card>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge
                  variant={orderStatus === "completed" ? "success" : "default"}>
                  {orderStatus ? orderStatus.replace("-", " ") : "Unknown"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {order.createdAt
                    ? new Date(
                        order.createdAt as string | Date
                      ).toLocaleDateString()
                    : "-"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      ) : null}
    </div>
  );
}
