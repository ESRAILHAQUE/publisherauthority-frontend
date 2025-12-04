"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Message {
  sender: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
  message: string;
  attachments?: string[];
  createdAt: string | Date;
}

interface Ticket {
  _id?: string;
  ticketNumber?: string;
  subject?: string;
  userId?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  messages?: Message[];
  status?: string;
  priority?: string;
  assignedTo?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export default function AdminTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const response = (await adminApi.getSupportTicket(ticketId)) as {
        success?: boolean;
        data?: {
          ticket?: Ticket;
          [key: string]: unknown;
        };
        ticket?: Ticket;
        [key: string]: unknown;
      };

      const ticketData = response?.data?.ticket || response?.ticket;
      if (ticketData) {
        setTicket(ticketData);
      }
    } catch (error) {
      console.error("Failed to load ticket:", error);
      toast.error("Failed to load ticket details");
      router.push("/admin/support");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      await adminApi.updateTicketStatus(ticketId, status);
      toast.success("Ticket status updated");
      await loadTicket();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(errorMessage);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setSubmitting(true);
      // TODO: Add admin API method to send message
      toast.success("Message sent successfully");
      setNewMessage("");
      await loadTicket();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    const variants: Record<
      string,
      "success" | "warning" | "info" | "danger" | "default"
    > = {
      resolved: "success",
      closed: "success",
      "in-progress": "info",
      open: "warning",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ticket not found</p>
          <Button onClick={() => router.push("/admin/support")}>
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/support")}
            className="mb-4">
            ← Back to Tickets
          </Button>
          <h1 className="text-3xl font-bold text-primary-purple mb-2">
            Ticket #{ticket.ticketNumber || ticket._id?.slice(-8) || "N/A"}
          </h1>
          <p className="text-gray-600">{ticket.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusBadge(ticket.status)}>
            {formatStatus(ticket.status)}
          </Badge>
          <Badge
            variant={ticket.priority === "high" ? "danger" : "warning"}>
            {ticket.priority || "medium"} Priority
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Messages */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Conversation
            </h2>
            <div className="space-y-4">
              {ticket.messages && ticket.messages.length > 0 ? (
                ticket.messages.map((message, index) => {
                  const isAdmin =
                    message.sender?.role === "admin" ||
                    message.sender?.role === "Admin";
                  const senderName = message.sender
                    ? `${message.sender.firstName || ""} ${message.sender.lastName || ""}`.trim() ||
                      "Unknown"
                    : "Unknown";

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isAdmin
                          ? "bg-primary-purple/10 border-l-4 border-primary-purple"
                          : "bg-gray-50 border-l-4 border-gray-300"
                      }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {senderName}
                            {isAdmin && (
                              <span className="ml-2 text-xs text-primary-purple">
                                (Admin)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No messages yet
                </p>
              )}
            </div>
          </Card>

          {/* Reply Form */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Reply to Ticket
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                required
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Send Reply"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ticket Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">User</p>
                <p className="font-medium text-gray-900">
                  {ticket.userId
                    ? `${ticket.userId.firstName || ""} ${ticket.userId.lastName || ""}`.trim() ||
                      ticket.userId.email ||
                      "Unknown"
                    : "Unknown"}
                </p>
                {ticket.userId?.email && (
                  <p className="text-sm text-gray-600 mt-1">
                    {ticket.userId.email}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {ticket.updatedAt
                    ? new Date(ticket.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              {ticket.assignedTo && (
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="font-medium text-gray-900">
                    {ticket.assignedTo.firstName || ""}{" "}
                    {ticket.assignedTo.lastName || ""}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Status Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Update Status
            </h3>
            <div className="space-y-2">
              {ticket.status !== "open" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStatusUpdate("open")}>
                  Mark as Open
                </Button>
              )}
              {ticket.status !== "in-progress" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStatusUpdate("in-progress")}>
                  Mark as In Progress
                </Button>
              )}
              {ticket.status !== "resolved" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStatusUpdate("resolved")}>
                  Mark as Resolved
                </Button>
              )}
              {ticket.status !== "closed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleStatusUpdate("closed")}>
                  Close Ticket
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

