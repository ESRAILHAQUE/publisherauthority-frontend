"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Modal } from "@/components/shared/Modal";
import { PublisherManageModal } from "@/components/admin/PublisherManageModal";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Publisher {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  accountLevel?: string;
  level?: string;
  completedOrders?: number;
  orders?: number;
  totalEarnings?: number;
  earnings?: number;
  accountStatus?: string;
  status?: string;
  [key: string]: unknown;
}

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showWebsitesModal, setShowWebsitesModal] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState<Publisher | null>(
    null
  );
  const [publisherWebsites, setPublisherWebsites] = useState<Record<string, unknown>[]>([]);
  const [loadingWebsites, setLoadingWebsites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string[]>([]);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showLevelFilter, setShowLevelFilter] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement | null>(null);
  const levelFilterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    loadPublishers();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (showStatusFilter && statusFilterRef.current && !statusFilterRef.current.contains(e.target as Node)) {
        setShowStatusFilter(false);
      }
      if (showLevelFilter && levelFilterRef.current && !levelFilterRef.current.contains(e.target as Node)) {
        setShowLevelFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStatusFilter, showLevelFilter]);

  const loadPublishers = async () => {
    try {
      setLoading(true);
      const response = (await adminApi.getAllPublishers({}, 1, 100)) as {
        success?: boolean;
        data?: {
          publishers?: Publisher[];
          [key: string]: unknown;
        };
        publishers?: Publisher[];
        [key: string]: unknown;
      };

      // Handle different response structures
      let publishersData: Publisher[] = [];
      if (Array.isArray(response)) {
        publishersData = response;
      } else if (
        response?.data?.publishers &&
        Array.isArray(response.data.publishers)
      ) {
        publishersData = response.data.publishers;
      } else if (response?.publishers && Array.isArray(response.publishers)) {
        publishersData = response.publishers;
      }

      setPublishers(publishersData);
    } catch (error) {
      console.error("Failed to load publishers:", error);
      toast.error("Failed to load publishers");
      setPublishers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManage = (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setShowManageModal(true);
  };

  const handleViewWebsites = async (publisher: Publisher) => {
    setSelectedPublisher(publisher);
    setShowWebsitesModal(true);
    await loadPublisherWebsites(publisher);
  };

  const loadPublisherWebsites = async (publisher: Publisher) => {
    if (!publisher._id && !publisher.id) return;

    try {
      setLoadingWebsites(true);
      const publisherId = publisher._id || publisher.id;
      const response = (await adminApi.getPublisherDetails(
        publisherId as string
      )) as {
        success?: boolean;
        data?: {
          publisher?: Record<string, unknown>;
          websites?: Record<string, unknown>[];
          recentOrders?: Record<string, unknown>[];
          recentPayments?: Record<string, unknown>[];
          [key: string]: unknown;
        };
        publisher?: Record<string, unknown>;
        websites?: Record<string, unknown>[];
        recentOrders?: Record<string, unknown>[];
        recentPayments?: Record<string, unknown>[];
        [key: string]: unknown;
      };

      console.log("Publisher details response:", response);

      // Handle different response structures
      let websites: Record<string, unknown>[] = [];
      if (response?.data?.websites && Array.isArray(response.data.websites)) {
        websites = response.data.websites;
      } else if (response?.data && typeof response.data === 'object') {
        // Try to find websites in nested structure
        const data = response.data as Record<string, unknown>;
        if (Array.isArray(data.websites)) {
          websites = data.websites;
        }
      } else if (response?.websites && Array.isArray(response.websites)) {
        websites = response.websites;
      }

      console.log("Extracted websites:", websites);
      setPublisherWebsites(websites);
    } catch (error) {
      console.error("Failed to load publisher websites:", error);
      toast.error("Failed to load websites");
      setPublisherWebsites([]);
    } finally {
      setLoadingWebsites(false);
    }
  };

  const handleModalClose = () => {
    setShowManageModal(false);
    setSelectedPublisher(null);
  };

  const handleWebsitesModalClose = () => {
    setShowWebsitesModal(false);
    setSelectedPublisher(null);
    setPublisherWebsites([]);
  };

  const handleUpdate = async () => {
    await loadPublishers();
  };

  const filteredPublishers = publishers.filter((publisher) => {
    // Search filter
    const matchesSearch =
      (publisher.firstName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (publisher.lastName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (publisher.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (publisher.email || "").toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const publisherStatus = (publisher.accountStatus || publisher.status || "active").toLowerCase();
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(publisherStatus);

    // Level filter
    const publisherLevel = (publisher.accountLevel || publisher.level || "silver").toLowerCase();
    const matchesLevel =
      levelFilter.length === 0 || levelFilter.includes(publisherLevel);

    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Manage Publishers
        </h1>
        <p className="text-gray-600">
          View and manage all publishers on the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-primary-purple focus:border-primary-purple"
        />

        {/* Status Filter */}
        <div className="relative" ref={statusFilterRef}>
          <button
            onClick={() => setShowStatusFilter(!showStatusFilter)}
            className={`px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 ${
              statusFilter.length > 0
                ? "border-primary-purple bg-purple-50 text-primary-purple"
                : "border-gray-300"
            }`}>
            Status Filter {statusFilter.length > 0 && `(${statusFilter.length})`}
          </button>

          {showStatusFilter && (
            <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 right-0">
              <div className="p-2 text-sm">
                {["active", "suspended", "deleted"].map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
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
                  className="text-xs mt-2 text-gray-500 hover:underline ml-2">
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Level Filter */}
        <div className="relative" ref={levelFilterRef}>
          <button
            onClick={() => setShowLevelFilter(!showLevelFilter)}
            className={`px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 ${
              levelFilter.length > 0
                ? "border-primary-purple bg-purple-50 text-primary-purple"
                : "border-gray-300"
            }`}>
            Level Filter {levelFilter.length > 0 && `(${levelFilter.length})`}
          </button>

          {showLevelFilter && (
            <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50 right-0">
              <div className="p-2 text-sm">
                {["silver", "gold", "premium"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={levelFilter.includes(level)}
                      onChange={() => {
                        setLevelFilter((prev) =>
                          prev.includes(level)
                            ? prev.filter((l) => l !== level)
                            : [...prev, level]
                        );
                      }}
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
                <button
                  onClick={() => setLevelFilter([])}
                  className="text-xs mt-2 text-gray-500 hover:underline ml-2">
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Loading publishers..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Level
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Orders
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Earnings
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPublishers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 px-4 text-center text-gray-500">
                      {publishers.length === 0
                        ? "No publishers found"
                        : "No publishers match the filters"}
                    </td>
                  </tr>
                ) : (
                  filteredPublishers.map((publisher) => {
                    const level = (publisher.accountLevel ||
                      publisher.level ||
                      "silver") as string;
                    return (
                      <tr
                        key={publisher._id || publisher.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {publisher.firstName || ""} {publisher.lastName || ""}{" "}
                          {publisher.name || ""}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {publisher.email || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              level === "premium"
                                ? "purple"
                                : level === "gold"
                                ? "warning"
                                : "default"
                            }>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {
                            (publisher.completedOrders ||
                              publisher.orders ||
                              0) as number
                          }
                        </td>
                        <td className="py-4 px-4 font-semibold text-primary-purple">
                          $
                          {(
                            (publisher.totalEarnings ||
                              publisher.earnings ||
                              0) as number
                          ).toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              (publisher.accountStatus || publisher.status) === "suspended"
                                ? "danger"
                                : (publisher.accountStatus || publisher.status) === "deleted"
                                ? "danger"
                                : "success"
                            }>
                            {((publisher.accountStatus || publisher.status) || "Active")
                              .charAt(0)
                              .toUpperCase() +
                              ((publisher.accountStatus || publisher.status) || "Active")
                                .slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleManage(publisher)}>
                              Manage
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewWebsites(publisher)}>
                              View Websites
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Publisher Manage Modal */}
      {selectedPublisher && (
        <PublisherManageModal
          isOpen={showManageModal}
          onClose={handleModalClose}
          publisher={selectedPublisher}
          onUpdate={handleUpdate}
        />
      )}

      {/* Publisher Websites Modal */}
      {selectedPublisher && (
        <PublisherWebsitesModal
          isOpen={showWebsitesModal}
          onClose={handleWebsitesModalClose}
          publisher={selectedPublisher}
          websites={publisherWebsites}
          loading={loadingWebsites}
        />
      )}
    </div>
  );
}

// Publisher Websites Modal Component
interface PublisherWebsitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher: Publisher;
  websites: Record<string, unknown>[];
  loading: boolean;
}

function PublisherWebsitesModal({
  isOpen,
  onClose,
  publisher,
  websites,
  loading,
}: PublisherWebsitesModalProps) {
  const pendingWebsites = websites.filter(
    (w) => (w.status as string)?.toLowerCase() === "pending"
  );

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${publisher.firstName || ""} ${publisher.lastName || ""}${publisher.name || ""} - Websites`}
      size="xl"
      footer={
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      }>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Total Websites</p>
          <p className="text-2xl font-bold text-blue-900">
            {websites.length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600 mb-1">Pending Websites</p>
          <p className="text-2xl font-bold text-yellow-900">
            {pendingWebsites.length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 mb-1">Active Websites</p>
          <p className="text-2xl font-bold text-green-900">
            {
              websites.filter(
                (w) => (w.status as string)?.toLowerCase() === "active"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Websites Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size="md" text="Loading websites..." />
        </div>
      ) : websites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No websites found for this publisher
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Website URL
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  DA Score
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Traffic
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Niche
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
              </tr>
            </thead>
            <tbody>
              {websites.map((website) => {
                const websiteId = website._id || website.id;
                return (
                  <tr
                    key={websiteId ? String(websiteId) : undefined}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      (website.status as string)?.toLowerCase() === "pending"
                        ? "bg-yellow-50"
                        : ""
                    }`}>
                    <td className="py-4 px-4">
                      <a
                        href={(website.url as string) || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-purple hover:text-accent-teal font-medium">
                        {(website.url as string) || "N/A"}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {String(website.domainAuthority || website.da || "-")}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {(
                        (website.monthlyTraffic ||
                          website.traffic ||
                          0) as number
                      ).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {(website.niche as string) || "-"}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      ${(typeof website.price === 'number' ? website.price : 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={getStatusBadge(website.status as string)}>
                        {formatStatus(website.status as string)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {website.submittedAt
                        ? new Date(
                            website.submittedAt as string | Date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
