"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Textarea } from "@/components/shared/Textarea";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

type VerificationMethod = "tag" | "article";

interface AdminWebsite {
  _id?: string;
  id?: string;
  url?: string;
  status?: string;
  verificationMethod?: VerificationMethod;
  verificationCode?: string;
  verificationArticleUrl?: string;
  submittedAt?: string | Date;
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function AdminWebsiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const websiteId = (params?.id as string) || "";

  const [website, setWebsite] = useState<AdminWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!websiteId) return;
    loadWebsite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteId]);

  const loadWebsite = async () => {
    try {
      setLoading(true);
      const resp = (await adminApi.getWebsite(websiteId)) as any;
      const data = resp?.data?.website || resp?.website || resp?.data || resp;
      setWebsite(data as AdminWebsite);
    } catch (error) {
      console.error("Failed to load website", error);
      toast.error("Failed to load website");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!website?.verificationMethod) {
      toast.error("Publisher has not submitted verification yet.");
      return;
    }
    setActionLoading(true);
    try {
      await adminApi.verifyWebsite(
        websiteId,
        website.verificationMethod as VerificationMethod
      );
      toast.success("Website verified");
      router.push("/admin/websites");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to verify website";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setActionLoading(true);
    try {
      await adminApi.updateWebsiteStatus(
        websiteId,
        "rejected",
        rejectionReason.trim()
      );
      toast.success("Website rejected");
      router.push("/admin/websites");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to reject website";
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const statusBadge = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      case "counter-offer":
        return <Badge variant="info">Counter Offer</Badge>;
      default:
        return <Badge variant="default">{status || "Unknown"}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" text="Loading website..." />
      </div>
    );
  }

  if (!website) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push("/admin/websites")}>
          ← Back to Websites
        </Button>
        <Card>
          <p className="text-red-600">Website not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-1">
            Review Verification
          </h1>
          <p className="text-gray-600">
            Check the submitted verification method before approving.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push("/admin/websites")}>
            ← Back to Websites
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {website.url}
            </h2>
            <p className="text-sm text-gray-600">
              Submitted on{" "}
              {website.submittedAt
                ? new Date(website.submittedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          {statusBadge(website.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Publisher
            </p>
            <p className="text-base font-medium">
              {`${website.userId?.firstName || ""} ${
                website.userId?.lastName || ""
              }`.trim() || "Unknown"}
            </p>
            <p className="text-sm text-gray-600">{website.userId?.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Verification Method
            </p>
            <p className="text-base font-medium">
              {website.verificationMethod === "tag"
                ? "HTML Tag"
                : website.verificationMethod === "article"
                ? "Verification Article"
                : "Not submitted"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Verification Details
        </h3>

        {!website.verificationMethod && (
          <p className="text-sm text-gray-600">
            The publisher has not submitted verification yet.
          </p>
        )}

        {website.verificationMethod && (
          <div className="space-y-4">
            {website.verificationMethod === "tag" && (
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  Check that the following meta tag exists in the website head:
                </p>
                <div className="bg-gray-50 rounded border border-gray-200 p-3 font-mono text-sm overflow-x-auto">
                  {`<meta name="publisherauthority-verification" content="${website.verificationCode || ""
                    }" />`}
                </div>
              </div>
            )}

            {website.verificationMethod === "article" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  Confirm the article contains the required anchor text and link.
                </p>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Article URL
                  </p>
                  {website.verificationArticleUrl ? (
                    <Link
                      href={website.verificationArticleUrl}
                      target="_blank"
                      className="text-primary-purple hover:underline break-all"
                    >
                      {website.verificationArticleUrl}
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-600">Not provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              Approve only after confirming the verification content is correct.
            </p>
            {website.status === "rejected" && website?.verificationMethod && (
              <p className="text-xs text-red-600">
                Previously rejected. You can re-approve if verification is now
                valid.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowReject(true)}
              disabled={actionLoading}
            >
              Reject
            </Button>
            <Button onClick={handleApprove} isLoading={actionLoading}>
              Approve & Verify
            </Button>
          </div>
        </div>
      </Card>

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Provide rejection reason
            </h4>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why verification is rejected"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReject(false);
                  setRejectionReason("");
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleReject}
                isLoading={actionLoading}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

