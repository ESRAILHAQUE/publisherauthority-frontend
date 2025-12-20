"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import { Textarea } from "@/components/shared/Textarea";
import { Modal } from "@/components/shared/Modal";
import Link from "next/link";
import { websitesApi } from "@/lib/api";
import { WebsiteVerification } from "@/components/websites/WebsiteVerification";
import { CounterOfferModal } from "@/components/websites/CounterOfferModal";
import { WebsiteDetailsModal } from "@/components/websites/WebsiteDetailsModal";
import { websiteNiches } from "@/lib/niches";
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
  [key: string]: unknown;
}

function WebsitesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false);
  const [selectedWebsiteForCounterOffer, setSelectedWebsiteForCounterOffer] = useState<{
    id: string;
    price?: number;
  } | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWebsiteForDetails, setSelectedWebsiteForDetails] = useState<Website | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWebsiteForEdit, setSelectedWebsiteForEdit] = useState<Website | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);


  const filterRef = useRef<HTMLDivElement | null>(null);

  // Check URL params for filter and apply counter-offer filter
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "counter-offer") {
      setStatusFilter(["counter-offer"]);
    }
  }, [searchParams]);

  // If an admin lands on the dashboard websites page, send them to the admin websites manager
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = (await import("@/lib/api").then((m) => m.authApi.getMe())) as any;
        const user = me?.data?.user || me?.user;
        if (mounted && user?.role === "admin") {
          router.replace("/admin/websites");
        }
      } catch (err) {
        // ignore; stay on page for regular users
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    loadWebsites();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        showFilter &&
        filterRef.current &&
        !filterRef.current.contains(e.target as Node)
      ) {
        setShowFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);


  const loadWebsites = async () => {
    try {
      setLoading(true);
      const response = (await websitesApi.getWebsites()) as
        | {
          data?: Website[] | { websites?: Website[];[key: string]: unknown };
          websites?: Website[];
          [key: string]: unknown;
        }
        | Website[];
      
      // Handle different response structures
      let websitesData: Website[] = [];
      if (Array.isArray(response)) {
        websitesData = response;
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        if (Array.isArray(response.data)) {
          websitesData = response.data;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          "websites" in response.data &&
          Array.isArray(response.data.websites)
        ) {
          websitesData = response.data.websites;
        }
      } else if (
        response &&
        typeof response === "object" &&
        "websites" in response &&
        Array.isArray(response.websites)
      ) {
        websitesData = response.websites;
      }

      // Validate that all websites have valid IDs
      websitesData = websitesData.filter((w) => {
        const hasId = !!(w._id || w.id);
        if (!hasId && process.env.NODE_ENV === "development") {
          console.warn("Website without ID found:", w);
        }
        return hasId;
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Loaded websites:", websitesData.length, "websites");
        console.log("Website IDs:", websitesData.map(w => String(w._id || w.id)));
      }
      
      setWebsites(websitesData);
      // Clear selected website when list reloads to prevent stale data
      setSelectedWebsite(null);
    } catch (error) {
      console.error("Failed to load websites:", error);
      toast.error("Failed to load websites");
      setWebsites([]); // Ensure it's always an array
      setSelectedWebsite(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (
    websiteId: string,
    method: "tag" | "article",
    articleUrl?: string
  ): Promise<void> => {
    if (!websiteId || websiteId.trim() === "") {
      toast.error("Website ID is missing for verification.");
      return;
    }

    // Normalize website ID to string
    const normalizedWebsiteId = String(websiteId).trim();

    // Verify that the website exists in the user's websites list
    const websiteInList = websites.find(
      (w) => {
        const wId = String(w._id || w.id || "").trim();
        return wId === normalizedWebsiteId;
      }
    );
    
    if (!websiteInList) {
      if (process.env.NODE_ENV === "development") {
        console.error("Website not in list:", {
          requestedId: normalizedWebsiteId,
          availableIds: websites.map(w => String(w._id || w.id || "")),
          websitesCount: websites.length
        });
      }
      toast.error("Website not found in your list. Please refresh the page and try again.");
      await loadWebsites();
      setSelectedWebsite(null);
      return;
    }
    
    // Double validation: ensure website ID matches exactly
    const websiteIdFromList = String(websiteInList._id || websiteInList.id || "").trim();
    if (websiteIdFromList !== normalizedWebsiteId) {
      if (process.env.NODE_ENV === "development") {
        console.error("Website ID mismatch:", {
          requested: normalizedWebsiteId,
          found: websiteIdFromList
        });
      }
      toast.error("Website ID mismatch. Please refresh the page and try again.");
      await loadWebsites();
      setSelectedWebsite(null);
      return;
    }

    // Additional validation: ensure website status allows verification
    if (websiteInList.status === "active") {
      toast.error("This website is already verified.");
      return;
    }

    try {
      if (process.env.NODE_ENV === "development") {
        console.log("Verifying website:", { 
          websiteId: normalizedWebsiteId, 
          method, 
          articleUrl,
          websiteUrl: websiteInList.url,
          websiteStatus: websiteInList.status,
          allWebsiteIds: websites.map(w => String(w._id || w.id || ""))
        });
      }
      
      if (method === "tag") {
        await websitesApi.verifyWebsite(normalizedWebsiteId);
      } else {
        if (!articleUrl || articleUrl.trim() === "") {
          toast.error("Please provide the article URL");
          return;
        }
        await websitesApi.verifyWebsiteArticle(normalizedWebsiteId, articleUrl.trim());
      }
      toast.success("Verification submitted successfully. Status is pending and admin will manually check.");
      await loadWebsites();
      setSelectedWebsite(null);
    } catch (error: unknown) {
      // Only log in development
      if (process.env.NODE_ENV === "development") {
        try {
          console.error("Verification error:", {
            error: error instanceof Error ? error.message : String(error),
            websiteId: normalizedWebsiteId,
            method,
            articleUrl
          });
        } catch (logError) {
          // Silently ignore logging errors
        }
      }
      
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed. Please try again.";
      
      // Provide more specific error messages
      if (errorMessage.includes("not found") || errorMessage.includes("404")) {
        toast.error("Website not found. Please refresh the page and try again.");
        await loadWebsites();
        setSelectedWebsite(null);
      } else {
        toast.error(errorMessage);
      }
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

  const handleEdit = (website: Website) => {
    setSelectedWebsiteForEdit(website);
    setShowEditModal(true);
  };

  const handleDelete = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(websiteId);
    try {
      await websitesApi.deleteWebsite(websiteId);
      toast.success("Website deleted successfully");
      await loadWebsites();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete website";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateWebsite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedWebsiteForEdit) return;

    const websiteId = selectedWebsiteForEdit._id || selectedWebsiteForEdit.id;
    if (!websiteId) {
      toast.error("Website ID not found");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const updateData = {
      url: formData.get("url") as string,
      domainAuthority: parseInt(formData.get("domainAuthority") as string),
      monthlyTraffic: parseInt(formData.get("monthlyTraffic") as string),
      niche: formData.get("niche") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
    };

    try {
      await websitesApi.updateWebsite(String(websiteId), updateData);
      toast.success("Website updated successfully");
      setShowEditModal(false);
      setSelectedWebsiteForEdit(null);
      await loadWebsites();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update website";
      toast.error(errorMessage);
    }
  };

  const handleRespondToCounterOffer = async (websiteId: string, accept: boolean) => {
    try {
      await websitesApi.respondToCounterOffer(websiteId, accept);
      toast.success(`Counter offer ${accept ? "accepted" : "rejected"}`);
      await loadWebsites();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to respond to counter offer";
      toast.error(errorMessage);
    }
  };

  const handleOpenCounterOfferModal = (websiteId: string, currentPrice?: number) => {
    setSelectedWebsiteForCounterOffer({ id: websiteId, price: currentPrice });
    setShowCounterOfferModal(true);
  };

  const handleSendCounterOffer = async (data: { price: number; notes?: string; terms?: string }) => {
    if (!selectedWebsiteForCounterOffer) return;

    try {
      await websitesApi.sendCounterOffer(selectedWebsiteForCounterOffer.id, data);
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

  const filteredWebsites = websites.filter((w) => {
    const text = searchQuery.toLowerCase();

    const matchesSearch =
      (w.url || "").toLowerCase().includes(text) ||
      (w.niche || "").toLowerCase().includes(text) ||
      String(w.price || "").toLowerCase().includes(text) ||
      formatStatus(w.status || "").toLowerCase().includes(text);

    const matchesStatus =
      statusFilter.length === 0
        ? true
        : statusFilter.includes((w.status || "").toLowerCase());

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-2">
            My Websites
          </h1>
          <p className="text-gray-600">Manage all your submitted websites.</p>
          <div className="flex items-center justify-between my-6 gap-4">

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search websites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-primary-purple focus:border-primary-purple"
            />

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className={`px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 ${
                  statusFilter.length > 0
                    ? "border-primary-purple bg-purple-50 text-primary-purple font-medium"
                    : "border-gray-300"
                }`}
              >
                Status Filter
                {statusFilter.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-primary-purple text-white text-xs rounded-full">
                    {statusFilter.length}
                  </span>
                )}
              </button>

              {showFilter && (
                <div
                  ref={filterRef}
                  className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
                >
                  <div className="p-2 text-sm">

                    {["pending", "active", "counter-offer", "rejected"].map((status) => (
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
                        <span className="capitalize">{formatStatus(status)}</span>
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

          </div>

        </div>

        <Link href="/dashboard/websites/add">
          <Button variant="primary">Add New Website</Button>
        </Link>
      </div>

      {selectedWebsite && (selectedWebsite._id || selectedWebsite.id) && (
        <WebsiteVerification
          website={{
            _id: (selectedWebsite._id || selectedWebsite.id) as string,
            url:
              typeof selectedWebsite.url === "string"
                ? selectedWebsite.url
                : "",
            verificationCode:
              typeof selectedWebsite.verificationCode === "string"
                ? selectedWebsite.verificationCode
                : "",
            status:
              typeof selectedWebsite.status === "string"
                ? selectedWebsite.status
                : "pending",
            verificationMethod:
              typeof selectedWebsite.verificationMethod === "string"
                ? (selectedWebsite.verificationMethod as "tag" | "article")
                : undefined,
            rejectedReason:
              typeof selectedWebsite.rejectedReason === "string"
                ? selectedWebsite.rejectedReason
                : undefined,
          }}
          onVerify={async (method, articleUrl) => {
            const websiteId = selectedWebsite._id || selectedWebsite.id;
            if (!websiteId) {
              toast.error("Website ID not found");
              return;
            }
            
            // Normalize website ID
            const normalizedId = String(websiteId).trim();
            
            // Double-check that the website exists in the user's list before verifying
            const websiteInList = websites.find(
              (w) => {
                const wId = String(w._id || w.id || "").trim();
                return wId === normalizedId;
              }
            );
            
            if (!websiteInList) {
              toast.error("Website not found in your list. Please refresh the page.");
              await loadWebsites();
              setSelectedWebsite(null);
              return;
            }
            
            // Ensure we're using the website from the list (not stale selectedWebsite)
            await handleVerify(normalizedId, method, articleUrl);
          }}
        />
      )}

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader size="lg" text="Loading websites..." />
            </div>
          ) : (
            <>
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
                      Monthly Traffic
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Verified
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWebsites.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-8 px-4 text-center text-gray-500">
                        No websites added yet.{" "}
                        <Link
                          href="/dashboard/websites/add"
                          className="text-primary-purple hover:underline">
                          Add your first website
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    filteredWebsites.map((website) => (
                      <tr
                        key={website._id || website.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <a
                            href={website.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-purple hover:text-[#2EE6B7] font-medium">
                            {website.url || "N/A"}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {website.domainAuthority || website.da || "-"}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {(
                            (website.monthlyTraffic ||
                              website.traffic ||
                              0) as number
                          ).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          ${(typeof website.price === 'number' ? website.price : 0).toFixed(2)}
                          {website.counterOffer && (
                            <div className="text-xs text-blue-600 mt-1">
                              Offer: ${(typeof website.counterOffer.price === 'number' ? website.counterOffer.price : 0).toFixed(2)}
                              {website.counterOffer.offeredBy === "admin" && (
                                <span className="ml-1">(Admin)</span>
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
                                ? "Admin counter offer - respond below"
                                : "Your counter offer - waiting for admin"}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {website.status === "active" ? (
                            <span className="text-green-600 font-medium">Verified</span>
                          ) : website.status === "rejected" ? (
                            <div className="space-y-2">
                              <span className="text-red-600 font-medium">Rejected</span>
                              {website.rejectedReason && (
                                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
                                  <p className="font-semibold">Reason:</p>
                                  <p>{website.rejectedReason}</p>
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  const websiteId = website._id || website.id;
                                  if (websiteId) {
                                    const normalizedId = String(websiteId).trim();
                                    const websiteInList = websites.find((w) => {
                                      const wId = String(w._id || w.id || "").trim();
                                      return wId === normalizedId;
                                    });
                                    if (websiteInList) {
                                      setSelectedWebsite(websiteInList);
                                    } else {
                                      toast.error("Website not found. Please refresh the page.");
                                      loadWebsites();
                                    }
                                  }
                                }}
                                className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors cursor-pointer"
                              >
                                Resubmit verification
                              </button>
                            </div>
                          ) : website.verificationMethod ? (
                            <span className="text-yellow-600 font-medium">Pending Verification</span>
                          ) : (
                            <button
                              onClick={() => {
                                const websiteId = website._id || website.id;
                                if (websiteId) {
                                  // Normalize IDs for comparison
                                  const normalizedId = String(websiteId).trim();
                                  
                                  // Ensure the website exists in the current user's websites list
                                  const websiteInList = websites.find(
                                    (w) => {
                                      const wId = String(w._id || w.id || "").trim();
                                      return wId === normalizedId;
                                    }
                                  );
                                  
                                  if (websiteInList) {
                                    setSelectedWebsite(websiteInList);
                                  } else {
                                    toast.error("Website not found. Please refresh the page.");
                                    loadWebsites();
                                  }
                                }
                              }}
                              className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors cursor-pointer"
                            >
                              Site to be verified
                            </button>
                          )}
                        </td>


                        <td className="py-4 px-4">
                          <div className="flex flex-col items-start space-y-2">
                            <button
                              onClick={() => {
                                setSelectedWebsiteForDetails(website);
                                setShowDetailsModal(true);
                              }}
                              className="text-primary-purple hover:text-[#2EE6B7] text-sm font-medium transition-colors">
                              View Details
                            </button>
                            {website.status !== "active" && (
                              <>
                                <button
                                  onClick={() => handleEdit(website)}
                                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    const websiteId = website._id || website.id;
                                    if (websiteId) handleDelete(String(websiteId));
                                  }}
                                  disabled={isDeleting === (website._id || website.id)}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                  {isDeleting === (website._id || website.id) ? "Deleting..." : "Delete"}
                                </button>
                              </>
                            )}
                            {website.status === "counter-offer" &&
                              website.counterOffer?.status === "pending" &&
                              website.counterOffer?.offeredBy === "admin" && (
                                <div className="flex flex-col space-y-1">
                                  <button
                                    onClick={() => {
                                      const websiteId = website._id || website.id;
                                      if (websiteId) {
                                        handleRespondToCounterOffer(String(websiteId), true);
                                      }
                                    }}
                                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => {
                                      const websiteId = website._id || website.id;
                                      if (websiteId) {
                                        handleRespondToCounterOffer(String(websiteId), false);
                                      }
                                    }}
                                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                    Reject
                                  </button>
                                  <button
                                    onClick={() => {
                                      const websiteId = website._id || website.id;
                                      if (websiteId) {
                                        handleOpenCounterOfferModal(String(websiteId), website.price);
                                      }
                                    }}
                                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                                    Counter Offer
                                  </button>
                                </div>
                              )}
                            {website.status === "counter-offer" &&
                              website.counterOffer?.offeredBy === "user" && (
                                <span className="text-xs text-gray-500">
                                  Waiting for admin response
                                </span>
                              )}
                            {website.status === "active" && (
                              <button
                                onClick={() => {
                                  const websiteId = website._id || website.id;
                                  if (websiteId) {
                                    handleOpenCounterOfferModal(String(websiteId), website.price);
                                  }
                                }}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                                Send Counter Offer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
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

      {/* Edit Website Modal */}
      {selectedWebsiteForEdit && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedWebsiteForEdit(null);
          }}
          title="Edit Website">
          <form onSubmit={handleUpdateWebsite} className="space-y-4">
            <Input
              label="Website URL"
              name="url"
              type="url"
              defaultValue={selectedWebsiteForEdit.url || ""}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Domain Authority (DA)"
                name="domainAuthority"
                type="number"
                defaultValue={selectedWebsiteForEdit.domainAuthority || selectedWebsiteForEdit.da || ""}
                min="0"
                required
              />
              <Input
                label="Monthly Organic Traffic"
                name="monthlyTraffic"
                type="number"
                defaultValue={selectedWebsiteForEdit.monthlyTraffic || selectedWebsiteForEdit.traffic || ""}
                min="0"
                required
              />
            </div>

            <Select
              label="Niche/Category"
              name="niche"
              defaultValue={selectedWebsiteForEdit.niche || ""}
              options={websiteNiches}
              required
            />

            <Input
              label="Price per Article ($)"
              name="price"
              type="number"
              defaultValue={selectedWebsiteForEdit.price || ""}
              min="0"
              step="0.01"
              required
            />

            <Textarea
              label="Description"
              name="description"
              defaultValue={selectedWebsiteForEdit.description || ""}
              rows={4}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedWebsiteForEdit(null);
                }}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Update Website
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default function WebsitesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader size="lg" text="Loading..." />
      </div>
    }>
      <WebsitesPageContent />
    </Suspense>
  );
}
