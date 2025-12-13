"use client";

import React, { useState } from "react";
import { Modal } from "../shared/Modal";
import { Input } from "../shared/Input";
import { Textarea } from "../shared/Textarea";
import { Button } from "../shared/Button";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    websiteId: string;
    publisherId: string;
    anchorText: string;
    targetUrl: string;
    content: string;
    deadline: string;
    earnings: number;
  }) => Promise<void>;
  websiteId: string;
  publisherId: string;
  websiteUrl?: string;
  publisherName?: string;
  websitePrice?: number;
}

export function AddOrderModal({
  isOpen,
  onClose,
  onSubmit,
  websiteId,
  publisherId,
  websiteUrl,
  publisherName,
  websitePrice,
}: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    anchorText: "",
    targetUrl: "",
    content: "",
    deadline: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    anchorText?: string;
    targetUrl?: string;
    content?: string;
    deadline?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    if (!formData.title.trim()) {
      setErrors({ title: "Order title is required" });
      return;
    }

    if (!formData.anchorText.trim()) {
      setErrors({ anchorText: "Anchor text is required" });
      return;
    }

    if (!formData.targetUrl.trim()) {
      setErrors({ targetUrl: "Target URL is required" });
      return;
    }

    // Validate URL format
    try {
      new URL(formData.targetUrl.trim());
    } catch {
      setErrors({ targetUrl: "Please enter a valid URL" });
      return;
    }

    if (!formData.content.trim()) {
      setErrors({ content: "Content is required" });
      return;
    }

    if (!formData.deadline) {
      setErrors({ deadline: "Deadline is required" });
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (deadlineDate < todayDate) {
      setErrors({ deadline: "Deadline must be in the future" });
      return;
    }

    // Use website price as earnings (price is already set)
    const earnings = websitePrice || 0;
    if (earnings <= 0) {
      setErrors({ deadline: "Website price is not set. Please set a price for the website first." });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        websiteId,
        publisherId,
        anchorText: formData.anchorText.trim(),
        targetUrl: formData.targetUrl.trim(),
        content: formData.content.trim(),
        deadline: new Date(formData.deadline).toISOString(),
        earnings,
      });
      // Reset form
      setFormData({
        title: "",
        anchorText: "",
        targetUrl: "",
        content: "",
        deadline: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      // Re-throw error so parent component can handle it (show toast, etc.)
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: "",
        anchorText: "",
        targetUrl: "",
        content: "",
        deadline: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Order"
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-order-form"
            isLoading={isSubmitting}
            disabled={isSubmitting}>
            Create Order
          </Button>
        </>
      }>
      <form id="add-order-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Order ID Display */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-1">Order ID</p>
          <p className="text-sm text-gray-900 font-mono">ORD-{Date.now()}-{Math.floor(Math.random() * 1000)}</p>
        </div>

        {/* Website and Publisher Info */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Website</p>
              <p className="text-sm text-gray-900 break-all">{websiteUrl || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Publisher</p>
              <p className="text-sm text-gray-900">{publisherName || "N/A"}</p>
            </div>
          </div>
        </div>

        <Input
          label="Order Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="e.g., SEO Best Practices Guide"
          required
          error={errors.title}
          disabled={isSubmitting}
        />

        <Input
          label="Anchor Text"
          name="anchorText"
          type="text"
          value={formData.anchorText}
          onChange={(e) =>
            setFormData({ ...formData, anchorText: e.target.value })
          }
          placeholder="e.g., best SEO practices"
          required
          error={errors.anchorText}
          disabled={isSubmitting}
        />

        <Input
          label="Target URL"
          name="targetUrl"
          type="url"
          value={formData.targetUrl}
          onChange={(e) =>
            setFormData({ ...formData, targetUrl: e.target.value })
          }
          placeholder="https://example.com/target-page"
          required
          error={errors.targetUrl}
          disabled={isSubmitting}
        />

        <Textarea
          label="Content"
          name="content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          rows={8}
          placeholder="Enter the content for the order..."
          required
          error={errors.content}
          disabled={isSubmitting}
        />

        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
          min={today}
          required
          error={errors.deadline}
          disabled={isSubmitting}
        />

        {/* Display Earnings (read-only, from website price) */}
        {websitePrice !== undefined && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">Earnings</p>
            <p className="text-lg font-semibold text-primary-purple">
              ${(websitePrice || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              (Based on website price)
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
}

