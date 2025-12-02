"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { Select } from "@/components/shared/Select";
import { adminApi, ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function CreateOrderPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    websiteId: "",
    publisherId: "",
    description: "",
    requirements: "",
    deadline: "",
    earnings: "",
    status: "pending",
  });

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const data = (await adminApi.getAllWebsites({ status: "active" })) as {
        websites?: Record<string, unknown>[];
        [key: string]: unknown;
      };
      setWebsites(data.websites || []);
    } catch (error) {
      console.error("Failed to load websites:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ordersApi.createOrder({
        ...formData,
        earnings: parseFloat(formData.earnings),
        deadline: new Date(formData.deadline).toISOString(),
      });
      toast.success("Order created successfully!");
      router.push("/admin/orders");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Create New Order
        </h1>
        <p className="text-gray-600">Create a new order for a publisher.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Order Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., SEO Best Practices Guide"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Website"
              value={formData.websiteId}
              onChange={(e) => {
                const website = websites.find(
                  (w) => (w as { _id?: string })._id === e.target.value
                ) as
                  | {
                      userId?: { _id?: string };
                      _id?: string;
                      [key: string]: unknown;
                    }
                  | undefined;
                setFormData({
                  ...formData,
                  websiteId: e.target.value,
                  publisherId: website?.userId?._id || "",
                });
              }}
              required
              options={[
                { value: "", label: "Select a website" },
                ...websites.map((website) => ({
                  value: String((website as { _id?: string })._id || ""),
                  label: `${
                    (website as { url?: string }).url ||
                    (website as { domain?: string }).domain ||
                    "Unknown"
                  } - ${
                    (
                      website as {
                        userId?: { firstName?: string; lastName?: string };
                      }
                    ).userId?.firstName || ""
                  } ${
                    (website as { userId?: { lastName?: string } }).userId
                      ?.lastName || ""
                  }`,
                })),
              ]}
            />

            <Input
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Earnings ($)"
              type="number"
              step="0.01"
              min="0"
              value={formData.earnings}
              onChange={(e) =>
                setFormData({ ...formData, earnings: e.target.value })
              }
              placeholder="150.00"
              required
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={[
                { value: "pending", label: "Pending" },
                { value: "ready-to-post", label: "Ready To Post" },
              ]}
            />
          </div>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            placeholder="Order description..."
          />

          <Textarea
            label="Requirements"
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            rows={6}
            placeholder="Detailed requirements for the order..."
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/orders")}
              disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} disabled={loading}>
              Create Order
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
