"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Ticket {
  _id?: string;
  id?: string;
  ticketNumber?: string;
  subject?: string;
  userId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    [key: string]: unknown;
  };
  name?: string;
  user?: string;
  status?: string;
  priority?: string;
  createdAt?: string | Date;
  [key: string]: unknown;
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = (await adminApi.getAllSupportTickets()) as {
        success?: boolean;
        data?: {
          tickets?: Ticket[];
          [key: string]: unknown;
        };
        tickets?: Ticket[];
        [key: string]: unknown;
      };
      
      const ticketsData = response?.data?.tickets || response?.tickets || [];
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, status: string) => {
    try {
      await adminApi.updateTicketStatus(ticketId, status);
      toast.success("Ticket status updated");
      await loadTickets();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update ticket";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Support Tickets
        </h1>
        <p className="text-gray-600">Manage customer support tickets.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Ticket ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Subject
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500">
                    Loading tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket._id || ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-600">
                      #
                      {ticket.ticketNumber ||
                        (ticket._id ? ticket._id.slice(-8) : "") ||
                        ticket.id ||
                        "N/A"}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {ticket.subject || "No subject"}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {ticket.userId
                        ? `${ticket.userId.firstName || ""} ${ticket.userId.lastName || ""}`.trim() || ticket.userId.email || "-"
                        : ticket.name || ticket.user || "-"}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "warning"
                            : ticket.status === "resolved"
                            ? "success"
                            : "info"
                        }>
                        {ticket.status
                          ? ticket.status.charAt(0).toUpperCase() +
                            ticket.status.slice(1)
                          : "Open"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          ticket.priority === "high" ? "danger" : "warning"
                        }>
                        {ticket.priority || "medium"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {ticket.createdAt
                        ? new Date(
                            ticket.createdAt as string | Date
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const ticketId = ticket._id || ticket.id;
                          if (ticketId)
                            router.push(`/admin/support/${ticketId}`);
                        }}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
