"use client";

import React from "react";
import { Modal } from "../shared/Modal";
import { Badge } from "../shared/Badge";
import { Button } from "../shared/Button";

interface WebsiteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: {
    _id?: string;
    id?: string;
    url?: string;
    status?: string;
    domainAuthority?: number;
    da?: number;
    monthlyTraffic?: number;
    traffic?: number;
    niche?: string;
    description?: string;
    price?: number;
    verificationMethod?: string;
    verificationCode?: string;
    verificationArticleUrl?: string;
    verifiedAt?: string | Date;
    submittedAt?: string | Date;
    approvedAt?: string | Date;
    rejectedReason?: string;
    counterOffer?: {
      price?: number;
      notes?: string;
      terms?: string;
      offeredBy?: string;
      offeredAt?: string | Date;
      status?: string;
    };
    userId?: {
      _id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      accountLevel?: string;
    };
    [key: string]: unknown;
  };
}

export function WebsiteDetailsModal({
  isOpen,
  onClose,
  website,
}: WebsiteDetailsModalProps) {
  const getStatusBadge = (status?: string) => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    const variants: Record<
      string,
      "success" | "warning" | "info" | "danger" | "default"
    > = {
      active: "success",
      pending: "warning",
      "counter-offer": "info",
      rejected: "danger",
      deleted: "default",
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

  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Website Details"
      size="lg"
      footer={
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      }>
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Website URL</p>
              <a
                href={website.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-purple hover:underline font-medium break-all">
                {website.url || "N/A"}
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <Badge variant={getStatusBadge(website.status)}>
                {formatStatus(website.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Niche/Category</p>
              <p className="font-medium text-gray-900">
                {website.niche || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Price per Article</p>
              <p className="font-semibold text-primary-purple text-lg">
                ${(typeof website.price === "number" ? website.price : 0).toFixed(2)}
              </p>
            </div>
          </div>
          {website.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {website.description}
              </p>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Domain Authority (DA)</p>
              <p className="font-semibold text-gray-900 text-xl">
                {website.domainAuthority || website.da || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Traffic</p>
              <p className="font-semibold text-gray-900 text-xl">
                {(
                  (website.monthlyTraffic || website.traffic || 0) as number
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Publisher Information */}
        {website.userId && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Publisher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-medium text-gray-900">
                  {website.userId.firstName || ""}{" "}
                  {website.userId.lastName || ""}
                  {!website.userId.firstName && !website.userId.lastName && "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">
                  {website.userId.email || "N/A"}
                </p>
              </div>
              {website.userId.accountLevel && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Level</p>
                  <Badge variant="info">{website.userId.accountLevel}</Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Information */}
        {(website.verificationMethod ||
          website.verificationCode ||
          website.verificationArticleUrl ||
          website.verifiedAt) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verification Information
            </h3>
            <div className="space-y-3">
              {website.verificationMethod && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Verification Method</p>
                  <Badge variant="info">
                    {website.verificationMethod === "tag"
                      ? "HTML Tag"
                      : website.verificationMethod === "article"
                      ? "Article"
                      : website.verificationMethod}
                  </Badge>
                </div>
              )}
              {website.verificationCode && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Verification Code</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {website.verificationCode}
                  </p>
                </div>
              )}
              {website.verificationArticleUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Verification Article URL</p>
                  <a
                    href={website.verificationArticleUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-purple hover:underline break-all">
                    {website.verificationArticleUrl as string}
                  </a>
                </div>
              )}
              {website.verifiedAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Verified At</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(website.verifiedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Counter Offer Information */}
        {website.counterOffer && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Counter Offer Information
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Counter Offer Price</p>
                  <p className="font-semibold text-blue-700 text-lg">
                    $
                    {(
                      typeof website.counterOffer.price === "number"
                        ? website.counterOffer.price
                        : 0
                    ).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Offered By</p>
                  <Badge
                    variant={
                      website.counterOffer.offeredBy === "admin"
                        ? "info"
                        : "warning"
                    }>
                    {website.counterOffer.offeredBy === "admin"
                      ? "Admin"
                      : "User"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge
                    variant={
                      website.counterOffer.status === "accepted"
                        ? "success"
                        : website.counterOffer.status === "rejected"
                        ? "danger"
                        : "warning"
                    }>
                    {website.counterOffer.status === "accepted"
                      ? "Accepted"
                      : website.counterOffer.status === "rejected"
                      ? "Rejected"
                      : "Pending"}
                  </Badge>
                </div>
                {website.counterOffer.offeredAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Offered At</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(website.counterOffer.offeredAt)}
                    </p>
                  </div>
                )}
              </div>
              {website.counterOffer.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {website.counterOffer.notes}
                  </p>
                </div>
              )}
              {website.counterOffer.terms && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terms</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {website.counterOffer.terms}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rejection Information */}
        {website.rejectedReason && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rejection Information
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Rejection Reason</p>
              <p className="text-red-700 whitespace-pre-wrap">
                {website.rejectedReason}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
          <div className="space-y-3">
            {website.submittedAt && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Submitted
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatDate(website.submittedAt)}
                  </p>
                </div>
              </div>
            )}
            {website.verifiedAt && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Verified</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(website.verifiedAt)}
                  </p>
                </div>
              </div>
            )}
            {website.approvedAt && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Approved</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(website.approvedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

