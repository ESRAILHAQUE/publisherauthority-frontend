"use client";

import React, { useState } from "react";
import { Modal } from "../shared/Modal";
import { Input } from "../shared/Input";
import { Textarea } from "../shared/Textarea";
import { Button } from "../shared/Button";

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { price: number; notes?: string; terms?: string }) => void;
  currentPrice?: number;
  title?: string;
  submitLabel?: string;
}

export function CounterOfferModal({
  isOpen,
  onClose,
  onSubmit,
  currentPrice,
  title = "Send Counter Offer",
  submitLabel = "Send Counter Offer",
}: CounterOfferModalProps) {
  const [formData, setFormData] = useState({
    price: "",
    notes: "",
    terms: "",
  });
  const [errors, setErrors] = useState<{ price?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      setErrors({ price: "Please enter a valid price greater than 0" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        price,
        notes: formData.notes.trim() || undefined,
        terms: formData.terms.trim() || undefined,
      });
      // Reset form
      setFormData({ price: "", notes: "", terms: "" });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error submitting counter offer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ price: "", notes: "", terms: "" });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="md"
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
            form="counter-offer-form"
            isLoading={isSubmitting}
            disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </>
      }>
      <form id="counter-offer-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Counter Offer Price ($)"
            name="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder={currentPrice ? `Current: $${currentPrice.toFixed(2)}` : "0.00"}
            min="0"
            step="0.01"
            required
            error={errors.price}
            disabled={isSubmitting}
          />
          {currentPrice && (
            <p className="text-sm text-gray-500 mt-1">
              Current price: ${currentPrice.toFixed(2)}
            </p>
          )}
        </div>

        <Textarea
          label="Notes (Optional)"
          name="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({ ...formData, notes: e.target.value })
          }
          rows={3}
          placeholder="Add any additional notes or comments..."
          disabled={isSubmitting}
        />

        <Textarea
          label="Terms (Optional)"
          name="terms"
          value={formData.terms}
          onChange={(e) =>
            setFormData({ ...formData, terms: e.target.value })
          }
          rows={3}
          placeholder="Specify any terms or conditions..."
          disabled={isSubmitting}
        />
      </form>
    </Modal>
  );
}

