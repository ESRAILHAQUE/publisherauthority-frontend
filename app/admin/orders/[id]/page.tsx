"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { adminApi, ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = (await adminApi.getOrder(orderId)) as
        | Record<string, unknown>
        | { data?: { order?: Record<string, unknown> }; order?: Record<string, unknown> };
      
      // Handle different response structures
      let orderData: Record<string, unknown> | null = null;
      if (response && typeof response === "object") {
        if ("data" in response && response.data && typeof response.data === "object" && "order" in response.data) {
          orderData = response.data.order as Record<string, unknown>;
        } else if ("order" in response) {
          orderData = response.order as Record<string, unknown>;
        } else {
          // Direct order object
          orderData = response as Record<string, unknown>;
        }
      }
      
      setOrder(orderData);
    } catch (error) {
      console.error("Failed to load order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRequestRevision = async () => {
    const reason = prompt("Enter revision reason:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await ordersApi.requestRevision(orderId, reason);
      toast.success("Revision requested successfully");
      await loadOrder();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request revision";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await ordersApi.cancelOrder(orderId, reason);
      toast.success("Order cancelled successfully");
      await loadOrder();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel order";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!confirm("Mark this order as completed?")) return;

    try {
      setActionLoading(true);
      await ordersApi.completeOrder(orderId);
      toast.success("Order marked as completed");
      await loadOrder();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to complete order";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  if (!order && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Button
          onClick={() => router.push("/admin/orders")}
          className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const orderStatus = order ? String(order.status || "") : "";
  const isVerifying = orderStatus === "verifying";
  const isCompleted = orderStatus === "completed";
  const isCancelled = orderStatus === "cancelled";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/orders")}>
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
                  order?.orderId ||
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
                : orderStatus === "revision-requested"
                ? "danger"
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
                  <p className="text-sm text-gray-600">Publisher</p>
                  <p className="font-medium">
                    {(() => {
                      const publisher = order.publisherId as { firstName?: string; lastName?: string } | undefined;
                      if (publisher) {
                        return `${publisher.firstName || ""} ${publisher.lastName || ""}`.trim() || "-";
                      }
                      return "-";
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="font-medium">
                    {(() => {
                      const website = order.websiteId as { url?: string } | undefined;
                      return website?.url || String(order.website || "-");
                    })()}
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
                {(() => {
                  const content = order.content;
                  const contentStr = content ? (typeof content === "string" ? content : String(content)) : "";
                  return contentStr.trim() ? (
                    <div>
                      <p className="text-sm text-gray-600">Content</p>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                        <p className="text-gray-700 whitespace-pre-line">{contentStr}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const anchorText = order.anchorText;
                  return anchorText ? (
                    <div>
                      <p className="text-sm text-gray-600">Anchor Text</p>
                      <p className="font-medium">{String(anchorText)}</p>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const targetUrl = order.targetUrl;
                  return targetUrl ? (
                    <div>
                      <p className="text-sm text-gray-600">Target URL</p>
                      <a
                        href={String(targetUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-purple hover:underline break-all">
                        {String(targetUrl)}
                      </a>
                    </div>
                  ) : null;
                })()}
                {(() => {
                  const keywords = order.keywords;
                  if (keywords && Array.isArray(keywords) && keywords.length > 0) {
                    return (
                      <div>
                        <p className="text-sm text-gray-600">Keywords</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(keywords as string[]).map((keyword, idx) => (
                            <Badge key={idx} variant="default" size="sm">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </Card>

            {/* Submission Details */}
            {(() => {
              const hasSubmittedUrl = order.submittedUrl && typeof order.submittedUrl === "string" ? order.submittedUrl : String(order.submittedUrl || "");
              return hasSubmittedUrl ? (
              <Card>
                <h2 className="text-xl font-semibold text-primary-purple mb-4">
                  Submission Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Submitted URL</p>
                    <a
                      href={
                        typeof order.submittedUrl === "string"
                          ? order.submittedUrl
                          : String(order.submittedUrl || "")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-purple hover:underline break-all">
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
                      <p className="text-sm text-gray-600">Submission Notes</p>
                      <p className="text-gray-700 whitespace-pre-line">
                        {typeof order.submissionNotes === "string"
                          ? order.submissionNotes
                          : String(order.submissionNotes || "")}
                      </p>
                    </div>
                  ) : null}
                </div>
              </Card>
              ) : null;
            })()}

            {/* Revision Notes */}
            {(() => {
              const revisionNotes = order.revisionNotes;
              return revisionNotes ? (
              <Card>
                <h2 className="text-xl font-semibold text-primary-purple mb-4">
                  Revision Notes
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-line">
                    {typeof order.revisionNotes === "string"
                      ? order.revisionNotes
                      : String(order.revisionNotes || "")}
                  </p>
                </div>
              </Card>
              ) : null;
            })()}

            {/* Verification Notes */}
            {(() => {
              const verificationNotes = order.verificationNotes;
              return verificationNotes ? (
              <Card>
                <h2 className="text-xl font-semibold text-primary-purple mb-4">
                  Verification Notes
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-line">
                    {typeof order.verificationNotes === "string"
                      ? order.verificationNotes
                      : String(order.verificationNotes || "")}
                  </p>
                </div>
              </Card>
              ) : null;
            })()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge
                    variant={
                      orderStatus === "completed"
                        ? "success"
                        : orderStatus === "ready-to-post"
                        ? "info"
                        : orderStatus === "verifying"
                        ? "warning"
                        : orderStatus === "revision-requested"
                        ? "danger"
                        : "default"
                    }>
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
                {order.assignedAt ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned:</span>
                    <span className="text-gray-900">
                      {new Date(
                        order.assignedAt as string | Date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ) : null}
                {order.completedAt ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed:</span>
                    <span className="text-gray-900">
                      {new Date(
                        order.completedAt as string | Date
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ) : null}
              </div>
            </Card>

            {/* Admin Actions */}
            {!isCompleted && !isCancelled && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  {isVerifying && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleRequestRevision}
                        isLoading={actionLoading}
                        disabled={actionLoading}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        Request Revision
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleCompleteOrder}
                        isLoading={actionLoading}
                        disabled={actionLoading}
                        className="w-full bg-green-600 hover:bg-green-700">
                        Mark Complete
                      </Button>
                    </>
                  )}
                  <Button
                    variant="secondary"
                    onClick={handleCancelOrder}
                    isLoading={actionLoading}
                    disabled={actionLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Cancel Order
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

