"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../shared/Modal";
import { Badge } from "../shared/Badge";
import { Button } from "../shared/Button";
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
  accountStatus?: string;
  status?: string;
  completedOrders?: number;
  orders?: number;
  totalEarnings?: number;
  earnings?: number;
  createdAt?: string | Date;
  [key: string]: unknown;
}

interface PublisherManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher: Publisher | null;
  onUpdate: () => void;
}

export function PublisherManageModal({
  isOpen,
  onClose,
  publisher,
  onUpdate,
}: PublisherManageModalProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<Publisher | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (isOpen && publisher) {
      const level = (publisher.accountLevel ||
        publisher.level ||
        "silver") as string;
      const status = (publisher.accountStatus ||
        publisher.status ||
        "active") as string;
      setSelectedLevel(level);
      setSelectedStatus(status);
      loadPublisherDetails();
    }
  }, [isOpen, publisher]);

  const loadPublisherDetails = async () => {
    if (!publisher?._id && !publisher?.id) return;

    try {
      setLoading(true);
      const publisherId = publisher._id || publisher.id;
      const response = (await adminApi.getPublisherDetails(
        publisherId as string
      )) as {
        success?: boolean;
        data?: {
          publisher?: Publisher;
          [key: string]: unknown;
        };
        publisher?: Publisher;
        [key: string]: unknown;
      };

      const publisherData =
        response?.data?.publisher || response?.publisher || publisher;
      setDetails(publisherData as Publisher);
    } catch (error) {
      console.error("Failed to load publisher details:", error);
      // Use the publisher data we already have
      setDetails(publisher);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLevel = async () => {
    if (!publisher?._id && !publisher?.id) return;
    if (!selectedLevel) {
      toast.error("Please select a level");
      return;
    }

    try {
      setLoading(true);
      const publisherId = publisher._id || publisher.id;
      await adminApi.updateUserLevel(publisherId as string, selectedLevel);
      toast.success("Publisher level updated successfully");
      onUpdate();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update publisher level";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!publisher?._id && !publisher?.id) return;
    if (!selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setLoading(true);
      const publisherId = publisher._id || publisher.id;
      await adminApi.updatePublisherStatus(
        publisherId as string,
        selectedStatus
      );
      toast.success("Publisher status updated successfully");
      onUpdate();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update publisher status";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const displayPublisher = details || publisher;
  if (!displayPublisher) return null;

  const currentLevel = (displayPublisher.accountLevel ||
    displayPublisher.level ||
    "silver") as string;
  const currentStatus = (displayPublisher.accountStatus ||
    displayPublisher.status ||
    "active") as string;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Publisher"
      size="lg"
      footer={
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
        </div>
      }>
      {loading && !details ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600">Loading publisher details...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Publisher Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Publisher Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="font-medium text-gray-900">
                  {displayPublisher.firstName || ""}{" "}
                  {displayPublisher.lastName || ""}
                  {displayPublisher.name || ""}
                  {!displayPublisher.firstName &&
                    !displayPublisher.lastName &&
                    !displayPublisher.name &&
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-900">
                  {displayPublisher.email || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Level</p>
                <Badge
                  variant={
                    currentLevel === "premium"
                      ? "purple"
                      : currentLevel === "gold"
                      ? "warning"
                      : "default"
                  }>
                  {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <Badge
                  variant={currentStatus === "active" ? "success" : "danger"}>
                  {currentStatus.charAt(0).toUpperCase() +
                    currentStatus.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="font-medium text-gray-900">
                  {
                    (displayPublisher.completedOrders ||
                      displayPublisher.orders ||
                      0) as number
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="font-semibold text-primary-purple">
                  $
                  {(
                    (displayPublisher.totalEarnings ||
                      displayPublisher.earnings ||
                      0) as number
                  ).toLocaleString()}
                </p>
              </div>
              {displayPublisher.createdAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Joined</p>
                  <p className="font-medium text-gray-900">
                    {new Date(displayPublisher.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Level Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Level Information
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Current Level:</strong> {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Completed Orders:</strong> {(displayPublisher.completedOrders || displayPublisher.orders || 0) as number}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Active Websites:</strong> {(displayPublisher.activeWebsites || 0) as number}
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Level Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• <strong>Silver:</strong> 0-49 orders, 30+ active websites</li>
                  <li>• <strong>Gold:</strong> 50-149 orders, 100+ active websites</li>
                  <li>• <strong>Premium:</strong> 150-300 orders, 500+ active websites</li>
                </ul>
                <p className="text-xs text-gray-500 mt-2 italic">
                  Level badge updates automatically based on completed orders and active websites.
                </p>
              </div>
            </div>
          </div>

          {/* Manual Level Override (Admin Only) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Manual Level Override
            </h3>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Level normally updates automatically. Use this only to manually override the system-calculated level.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent">
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <Button
                variant="primary"
                onClick={handleUpdateLevel}
                disabled={loading || selectedLevel === currentLevel}>
                {loading ? "Updating..." : "Override Level"}
              </Button>
            </div>
          </div>

          {/* Update Account Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Account Status
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent">
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <Button
                variant="primary"
                onClick={handleUpdateStatus}
                disabled={loading || selectedStatus === currentStatus}
                className={
                  selectedStatus === "suspended"
                    ? "bg-red-600 hover:bg-red-700"
                    : ""
                }>
                {loading ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
