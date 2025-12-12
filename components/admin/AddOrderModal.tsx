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
    description?: string;
    requirements?: string;
    deadline: string;
    earnings: number;
  }) => Promise<void>;
  websiteId: string;
  publisherId: string;
  websiteUrl?: string;
  publisherName?: string;
}

export function AddOrderModal({
  isOpen,
  onClose,
  onSubmit,
  websiteId,
  publisherId,
  websiteUrl,
  publisherName,
}: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    deadline: "",
    earnings: "",
  });
  const [errors, setErrors] = useState<{
    title?: string;
    deadline?: string;
    earnings?: string;
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

    const earnings = parseFloat(formData.earnings);
    if (!formData.earnings || isNaN(earnings) || earnings <= 0) {
      setErrors({ earnings: "Please enter a valid earnings amount greater than 0" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: formData.title.trim(),
        websiteId,
        publisherId,
        description: formData.description.trim() || undefined,
        requirements: formData.requirements.trim() || undefined,
        deadline: new Date(formData.deadline).toISOString(),
        earnings,
      });
      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        deadline: "",
        earnings: "",
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
        description: "",
        requirements: "",
        deadline: "",
        earnings: "",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Input
            label="Earnings ($)"
            name="earnings"
            type="number"
            value={formData.earnings}
            onChange={(e) =>
              setFormData({ ...formData, earnings: e.target.value })
            }
            placeholder="150.00"
            min="0"
            step="0.01"
            required
            error={errors.earnings}
            disabled={isSubmitting}
          />
        </div>

        <Textarea
          label="Description (Optional)"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          placeholder="Order description..."
          disabled={isSubmitting}
        />

        <Textarea
          label="Requirements (Optional)"
          name="requirements"
          value={formData.requirements}
          onChange={(e) =>
            setFormData({ ...formData, requirements: e.target.value })
          }
          rows={6}
          placeholder="Detailed requirements for the order..."
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}

