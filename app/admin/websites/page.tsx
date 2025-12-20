"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Modal } from "@/components/shared/Modal";
import { Textarea } from "@/components/shared/Textarea";
import { CounterOfferModal } from "@/components/websites/CounterOfferModal";
import { WebsiteDetailsModal } from "@/components/websites/WebsiteDetailsModal";
import { AddOrderModal } from "@/components/admin/AddOrderModal";
import { adminApi, websitesApi, ordersApi } from "@/lib/api";
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
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [selectedWebsiteForOrder, setSelectedWebsiteForOrder] = useState<Website | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedWebsiteForRejection, setSelectedWebsiteForRejection] = useState<{ id: string; url?: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 25;
  const [counts, setCounts] = useState({
    pending: 0,
    active: 0,
    rejected: 0,
    counterOffer: 0,
  });
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const filterRef = useRef<HTMLDivElement | null>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [minDa, setMinDa] = useState<number | "">("");
  const [maxDa, setMaxDa] = useState<number | "">("");
  const [minTraffic, setMinTraffic] = useState<number | "">("");
  const [maxTraffic, setMaxTraffic] = useState<number | "">("");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<string | null>(null);
  const filterDebounceRef = useRef<NodeJS.Timeout | null>(null);


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

  // Auto-apply filters/search without an Apply button (debounced)
  useEffect(() => {
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }
    filterDebounceRef.current = setTimeout(() => {
      loadWebsites(1);
    }, 250);

    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, [
    searchQuery,
    statusFilter,
    minDa,
    maxDa,
    minTraffic,
    maxTraffic,
    minPrice,
    maxPrice,
    nicheFilter,
    verifiedFilter,
  ]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showFilter && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);



  const loadWebsites = async (targetPage = page) => {
    try {
      setLoading(true);
      const response = (await adminApi.getAllWebsites(
        {
          status: statusFilter.length ? statusFilter.join(",") : undefined,
          search: searchQuery || undefined,
          minDa: minDa === "" ? undefined : String(minDa),
          maxDa: maxDa === "" ? undefined : String(maxDa),
          minTraffic: minTraffic === "" ? undefined : String(minTraffic),
          maxTraffic: maxTraffic === "" ? undefined : String(maxTraffic),
          minPrice: minPrice === "" ? undefined : String(minPrice),
          maxPrice: maxPrice === "" ? undefined : String(maxPrice),
          niche: nicheFilter || undefined,
          verified:
            verifiedFilter === null
              ? undefined
              : verifiedFilter === "verified"
              ? "true"
              : verifiedFilter === "unverified"
              ? "false"
              : undefined,
        },
        targetPage,
        limit
      )) as {
        data?: {
          websites?: Website[];
          total?: number;
          page?: number;
          pages?: number;
          counts?: {
            pending?: number;
            active?: number;
            rejected?: number;
            counterOffer?: number;
          };
          [key: string]: unknown;
        };
        websites?: Website[];
        total?: number;
        page?: number;
        pages?: number;
        counts?: {
          pending?: number;
          active?: number;
          rejected?: number;
          counterOffer?: number;
        };
        [key: string]: unknown;
      };
      // Handle different response structures
      const websites = response?.data?.websites || response?.websites || [];
      const totalCount =
        (response as any)?.data?.total ??
        (response as any)?.total ??
        websites.length;
      const pageNum =
        (response as any)?.data?.page ??
        (response as any)?.page ??
        targetPage;
      const totalPages =
        (response as any)?.data?.pages ??
        (response as any)?.pages ??
        Math.max(1, Math.ceil((totalCount || websites.length) / limit));
      const statusCounts =
        (response as any)?.data?.counts ??
        (response as any)?.counts ?? {
          pending: 0,
          active: 0,
          rejected: 0,
          counterOffer: 0,
        };

      setWebsites(websites);
      setTotal(totalCount || websites.length);
      setPage(Number(pageNum) || 1);
      setPages(Number(totalPages) || 1);
      setCounts({
        pending: statusCounts.pending || 0,
        active: statusCounts.active || 0,
        rejected: statusCounts.rejected || 0,
        counterOffer: statusCounts.counterOffer || 0,
      });
    } catch (error) {
      console.error("Failed to load websites:", error);
      toast.error("Failed to load websites");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (websiteId: string, method: "tag" | "article") => {
    if (!websiteId || websiteId.trim() === "") {
      toast.error("Website ID is missing");
      return;
    }

    try {
      // Use admin API endpoint for verification (no ownership check)
      await adminApi.verifyWebsite(websiteId, method);
      toast.success("Website verified successfully");
      await loadWebsites(page);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (websiteId: string, status: string) => {
    if (status === "rejected") {
      // Open rejection modal
      const website = websites.find(w => (w._id || w.id) === websiteId);
      setSelectedWebsiteForRejection({ 
        id: websiteId, 
        url: website?.url 
      });
      setRejectionReason("");
      setShowRejectionModal(true);
    } else {
      try {
        await adminApi.updateWebsiteStatus(websiteId, status);
        toast.success("Website status updated");
        await loadWebsites(page);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update status";
        toast.error(errorMessage);
      }
    }
  };

  const handleConfirmRejection = async () => {
    if (!selectedWebsiteForRejection || !rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    try {
      await adminApi.updateWebsiteStatus(
        selectedWebsiteForRejection.id, 
        "rejected", 
        rejectionReason.trim()
      );
      toast.success("Website rejected successfully");
      setShowRejectionModal(false);
      setSelectedWebsiteForRejection(null);
      setRejectionReason("");
      await loadWebsites(page);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject website";
      toast.error(errorMessage);
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
      await loadWebsites(page);
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
      await loadWebsites(page);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to accept counter offer";
      toast.error(errorMessage);
    }
  };

  const handleOpenAddOrderModal = (website: Website) => {
    setSelectedWebsiteForOrder(website);
    setShowAddOrderModal(true);
    setShowActions(null);
    setDropdownPosition(null);
  };

  const handleCreateOrder = async (data: {
    title: string;
    websiteId: string;
    publisherId: string;
    anchorText: string;
    targetUrl: string;
    content: string;
    deadline: string;
    earnings: number;
  }) => {
    try {
      await ordersApi.createOrder({
        ...data,
        status: "ready-to-post",
      });
      toast.success("Order created successfully!");
      await loadWebsites(page);
      setShowAddOrderModal(false);
      setSelectedWebsiteForOrder(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
      toast.error(errorMessage);
      throw error; // Re-throw to let modal handle it
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

  const filteredWebsites = websites;


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

      <div className="flex items-center justify-between mb-6 gap-4">
        {/* Status summary */}
        <div className="flex flex-wrap gap-3">
          <div className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
            <span className="font-semibold text-gray-800">Pending:</span>{" "}
            <span className="text-gray-700">{counts.pending}</span>
          </div>
          <div className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
            <span className="font-semibold text-gray-800">Active (Verified):</span>{" "}
            <span className="text-green-700">{counts.active}</span>
          </div>
          <div className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
            <span className="font-semibold text-gray-800">Counter Offers:</span>{" "}
            <span className="text-blue-700">{counts.counterOffer}</span>
          </div>
          <div className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm">
            <span className="font-semibold text-gray-800">Rejected:</span>{" "}
            <span className="text-red-700">{counts.rejected}</span>
          </div>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search websites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-primary-purple focus:border-primary-purple"
        />

        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setShowFilter((prev) => !prev)
            }
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
          >
            Status Filter
          </button>

          {showFilter && (
            <div
              ref={filterRef}
              className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
            >

              <div className="p-2 text-sm">

                {["pending", "approved", "rejected"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={() => {
                        setStatusFilter((prev) =>
                          prev.includes(status)
                            ? prev.filter((s) => s !== status)
                            : [...prev, status]
                        );
                      }}
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}

                <button
                  onClick={() => setStatusFilter([])}
                  className="text-xs mt-2 text-gray-500 hover:underline ml-2"
                >
                  Clear filters
                </button>

              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min DA"
              value={minDa === "" ? "" : minDa}
              onChange={(e) => setMinDa(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max DA"
              value={maxDa === "" ? "" : maxDa}
              onChange={(e) => setMaxDa(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min Traffic"
              value={minTraffic === "" ? "" : minTraffic}
              onChange={(e) =>
                setMinTraffic(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-28 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max Traffic"
              value={maxTraffic === "" ? "" : maxTraffic}
              onChange={(e) =>
                setMaxTraffic(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-28 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice === "" ? "" : minPrice}
              onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice === "" ? "" : maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-24 px-2 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Niche"
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <select
            value={verifiedFilter || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setVerifiedFilter(null);
              else if (val === "verified") setVerifiedFilter("verified");
              else setVerifiedFilter("unverified");
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value="">Verified: All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setStatusFilter([]);
              setMinDa("");
              setMaxDa("");
              setMinTraffic("");
              setMaxTraffic("");
              setMinPrice("");
              setMaxPrice("");
              setNicheFilter("");
              setVerifiedFilter(null);
            }}
          >
            Clear Filters
          </Button>
        </div>

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
                {(filteredWebsites.length === 0) ? (
                  <tr>
                    <td colSpan={10} className="py-8 px-4 text-center text-gray-500">
                      No matching websites
                    </td>
                  </tr>
                ) : (
                  filteredWebsites.map((website) => (
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
                        {website.status === "rejected" && website.rejectedReason && (
                          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{website.rejectedReason}</p>
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
                                {website.status === "active" && (
                                  <>
                                    <button
                                      onClick={() => {
                                        handleOpenAddOrderModal(website);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-primary-purple hover:bg-purple-50 font-medium">
                                      Add Order
                                    </button>
                                    <button
                                      onClick={() => {
                                        const websiteId =
                                          website._id || website.id;
                                        if (websiteId) {
                                          handleOpenCounterOfferModal(String(websiteId), website.price);
                                          setShowActions(null);
                                          setDropdownPosition(null);
                                        }
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50">
                                      Send Counter Offer
                                    </button>
                                  </>
                                )}
                                {website.status === "pending" && (
                                  <>
                                    <Link
                                      href={`/admin/websites/${website._id || website.id || ""}`}
                                      className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                      onClick={() => {
                                        setShowActions(null);
                                        setDropdownPosition(null);
                                      }}>
                                      Review Verification
                                    </Link>
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
        {/* Pagination */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            {total === 0
              ? "0"
              : `${(page - 1) * limit + 1}–${(page - 1) * limit + websites.length}`}{" "}
            of {total || websites.length} websites
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                loadWebsites(newPage);
              }}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {page} of {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages}
              onClick={() => {
                const newPage = Math.min(pages, page + 1);
                setPage(newPage);
                loadWebsites(newPage);
              }}
            >
              Next
            </Button>
          </div>
        </div>
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

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedWebsiteForRejection(null);
          setRejectionReason("");
        }}
        title="Reject Website"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectionModal(false);
                setSelectedWebsiteForRejection(null);
                setRejectionReason("");
              }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmRejection}
              disabled={!rejectionReason.trim()}>
              Reject Website
            </Button>
          </div>
        }>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Website: <span className="font-medium text-gray-900">{selectedWebsiteForRejection?.url || "N/A"}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this website. This reason will be visible to the publisher.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejecting this website..."
              rows={5}
              required
            />
          </div>
        </div>
      </Modal>

      {/* Add Order Modal */}
      {selectedWebsiteForOrder && (
        <AddOrderModal
          isOpen={showAddOrderModal}
          onClose={() => {
            setShowAddOrderModal(false);
            setSelectedWebsiteForOrder(null);
          }}
          onSubmit={handleCreateOrder}
          websiteId={selectedWebsiteForOrder._id || selectedWebsiteForOrder.id || ""}
          publisherId={selectedWebsiteForOrder.userId?._id || ""}
          websiteUrl={selectedWebsiteForOrder.url}
          publisherName={
            selectedWebsiteForOrder.userId
              ? `${selectedWebsiteForOrder.userId.firstName || ""} ${selectedWebsiteForOrder.userId.lastName || ""}`.trim()
              : undefined
          }
          websitePrice={typeof selectedWebsiteForOrder.price === "number" ? selectedWebsiteForOrder.price : undefined}
        />
      )}

    </div>
  );
}
