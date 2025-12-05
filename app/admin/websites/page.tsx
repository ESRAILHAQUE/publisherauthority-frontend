"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { CounterOfferModal } from "@/components/websites/CounterOfferModal";
import { WebsiteDetailsModal } from "@/components/websites/WebsiteDetailsModal";
import { adminApi, websitesApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Website {
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
  verificationMethod?: string;
  verificationCode?: string;
  verificationArticleUrl?: string;
  verifiedAt?: string | Date;
  submittedAt?: string | Date;
  approvedAt?: string | Date;
  rejectedReason?: string;
  price?: number;
  counterOffer?: {
    price?: number;
    notes?: string;
    terms?: string;
    offeredBy?: string;
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
}

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [selectedWebsiteForCounterOffer, setSelectedWebsiteForCounterOffer] = useState<{
    id: string;
    price?: number;
  } | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWebsiteForDetails, setSelectedWebsiteForDetails] = useState<Website | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActions) {
        const dropdown = dropdownRefs.current[showActions];
        const button = buttonRefs.current[showActions];
        if (dropdown && button) {
          if (
            !dropdown.contains(event.target as Node) &&
            !button.contains(event.target as Node)
          ) {
            setShowActions(null);
            setDropdownPosition(null);
          }
        }
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
      // Calculate dropdown position
      const button = buttonRefs.current[showActions];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
        });
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setLoading(true);
      const response = (await adminApi.getAllWebsites({}, 1, 100)) as {
        data?: {
          websites?: Website[];
          [key: string]: unknown;
        };
        websites?: Website[];
        [key: string]: unknown;
      };
      // Handle different response structures
      const websites = response?.data?.websites || response?.websites || [];
      setWebsites(websites);
    } catch (error) {
      console.error("Failed to load websites:", error);
      toast.error("Failed to load websites");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (websiteId: string, method: "tag" | "article") => {
    try {
      if (method === "tag") {
        await websitesApi.verifyWebsite(websiteId);
      } else {
        await websitesApi.verifyWebsite(websiteId);
      }
      toast.success("Website verified successfully");
      await loadWebsites();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (websiteId: string, status: string) => {
    if (status === "rejected") {
      const reason = prompt("Enter rejection reason:");
      if (!reason) return;

      try {
        await adminApi.updateWebsiteStatus(websiteId, status, reason);
        toast.success("Website status updated");
        await loadWebsites();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update status";
        toast.error(errorMessage);
      }
    } else {
      try {
        await adminApi.updateWebsiteStatus(websiteId, status);
        toast.success("Website status updated");
        await loadWebsites();
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update status";
        toast.error(errorMessage);
      }
    }
  };

  const handleOpenCounterOfferModal = (websiteId: string, currentPrice?: number) => {
    setSelectedWebsiteForCounterOffer({ id: websiteId, price: currentPrice });
    setShowCounterOfferModal(true);
    setShowActions(null);
    setDropdownPosition(null);
  };

  const handleSendCounterOffer = async (data: { price: number; notes?: string; terms?: string }) => {
    if (!selectedWebsiteForCounterOffer) return;

    try {
      await adminApi.sendCounterOffer(selectedWebsiteForCounterOffer.id, data);
      toast.success("Counter offer sent successfully");
      await loadWebsites();
      setShowCounterOfferModal(false);
      setSelectedWebsiteForCounterOffer(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send counter offer";
      toast.error(errorMessage);
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleAcceptUserCounterOffer = async (websiteId: string) => {
    if (!confirm("Accept this user's counter offer?")) return;

    try {
      await adminApi.acceptUserCounterOffer(websiteId);
      toast.success("Counter offer accepted");
      await loadWebsites();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to accept counter offer";
      toast.error(errorMessage);
    }
  };

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Website Management
        </h1>
        <p className="text-gray-600">
          Review and manage all submitted websites.
        </p>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Loading websites..." />
          </div>
        ) : (
          <div className="overflow-x-auto" style={{ overflowY: "visible" }}>
            <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Website URL
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Publisher
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Niche
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  DA
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Traffic
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Submitted
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {websites.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-8 px-4 text-center text-gray-500">
                    No websites found
                  </td>
                </tr>
              ) : (
                websites.map((website) => (
                  <tr
                    key={website._id || website.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      <a
                        href={website.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-purple hover:underline">
                        {website.url || "N/A"}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {website.userId?.firstName || ""}{" "}
                      {website.userId?.lastName || ""}
                      {website.userId?.accountLevel && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({website.userId.accountLevel})
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {website.userId?.email || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {website.niche || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {website.domainAuthority || website.da || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {(
                        (website.monthlyTraffic ||
                          website.traffic ||
                          0) as number
                      ).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      ${(typeof website.price === 'number' ? website.price : 0).toFixed(2)}
                      {website.counterOffer && (
                        <div className="text-xs text-blue-600 mt-1">
                          Offer: ${(typeof website.counterOffer.price === 'number' ? website.counterOffer.price : 0).toFixed(2)}
                          {website.counterOffer.offeredBy === "user" && (
                            <span className="ml-1">(User)</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(website.status)}>
                        {formatStatus(website.status)}
                      </Badge>
                      {website.rejectedReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {website.rejectedReason}
                        </div>
                      )}
                      {website.counterOffer && website.counterOffer.status === "pending" && (
                        <div className="text-xs text-blue-600 mt-1">
                          {website.counterOffer.offeredBy === "admin" 
                            ? "Waiting for user response"
                            : "User counter offer - waiting for admin"}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {website.submittedAt
                        ? new Date(website.submittedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        ref={(el) => {
                          const id = website._id || website.id || "";
                          if (id) buttonRefs.current[id] = el;
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() =>
                          setShowActions(
                            showActions === website._id
                              ? null
                              : website._id || website.id || null
                          )
                        }>
                        Actions
                      </button>
                      {showActions === (website._id || website.id) &&
                        dropdownPosition &&
                        typeof window !== "undefined" &&
                        createPortal(
                          <div
                            ref={(el) => {
                              const id = website._id || website.id || "";
                              if (id) dropdownRefs.current[id] = el;
                            }}
                            className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-9999"
                            style={{
                              top: `${dropdownPosition.top}px`,
                              right: `${dropdownPosition.right}px`,
                            }}>
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setSelectedWebsiteForDetails(website);
                                  setShowDetailsModal(true);
                                  setShowActions(null);
                                  setDropdownPosition(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                View Details
                              </button>
                              {website.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => {
                                      const websiteId =
                                        website._id || website.id;
                                      if (websiteId) {
                                        handleVerify(websiteId, "tag");
                                        setShowActions(null);
                                        setDropdownPosition(null);
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                    Verify (HTML Tag)
                                  </button>
                                  <button
                                    onClick={() => {
                                      const websiteId =
                                        website._id || website.id;
                                      if (websiteId) {
                                        handleVerify(websiteId, "article");
                                        setShowActions(null);
                                        setDropdownPosition(null);
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                    Verify (Article)
                                  </button>
                                  <button
                                    onClick={() => {
                                      const websiteId =
                                        website._id || website.id;
                                      if (websiteId) {
                                        handleOpenCounterOfferModal(String(websiteId), website.price);
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">
                                    Send Counter Offer
                                  </button>
                                  <button
                                    onClick={() => {
                                      const websiteId =
                                        website._id || website.id;
                                      if (websiteId) {
                                        handleUpdateStatus(
                                          websiteId,
                                          "rejected"
                                        );
                                        setShowActions(null);
                                        setDropdownPosition(null);
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                                    Reject
                                  </button>
                                </>
                              )}
                              {website.status === "counter-offer" && (
                                <>
                                  {website.counterOffer?.offeredBy === "user" && (
                                    <button
                                      onClick={() => {
                                        const websiteId = website._id || website.id;
                                        if (websiteId) {
                                          handleAcceptUserCounterOffer(websiteId);
                                          setShowActions(null);
                                          setDropdownPosition(null);
                                        }
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                      Accept User Counter Offer
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      const websiteId = website._id || website.id;
                                      if (websiteId) {
                                        handleUpdateStatus(websiteId, "active");
                                        setShowActions(null);
                                        setDropdownPosition(null);
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                                    Approve (Original Price)
                                  </button>
                                  <button
                                    onClick={() => {
                                      const websiteId = website._id || website.id;
                                      if (websiteId) {
                                        handleOpenCounterOfferModal(String(websiteId), website.price);
                                      }
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">
                                    Send New Counter Offer
                                  </button>
                                </>
                              )}
                            </div>
                          </div>,
                          document.body
                        )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </Card>

      {/* Counter Offer Modal */}
      <CounterOfferModal
        isOpen={showCounterOfferModal}
        onClose={() => {
          setShowCounterOfferModal(false);
          setSelectedWebsiteForCounterOffer(null);
        }}
        onSubmit={handleSendCounterOffer}
        currentPrice={selectedWebsiteForCounterOffer?.price}
        title="Send Counter Offer"
        submitLabel="Send Counter Offer"
      />

      {/* Website Details Modal */}
      {selectedWebsiteForDetails && (
        <WebsiteDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedWebsiteForDetails(null);
          }}
          website={selectedWebsiteForDetails}
        />
      )}

    </div>
  );
}
