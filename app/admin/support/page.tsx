"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";
import { useMemo } from "react";

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
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    loadTickets();
  }, [statusFilter, priorityFilter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const filters: Record<string, string> = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const response = (await adminApi.getAllSupportTickets(filters)) as {
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

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tickets;
    return tickets.filter((t) => {
      const subject = t.subject || "";
      const ticketNumber = t.ticketNumber || "";
      const userName = t.userId
        ? `${t.userId.firstName || ""} ${t.userId.lastName || ""}`.trim()
        : "";
      const email = t.userId?.email || "";
      return (
        subject.toLowerCase().includes(term) ||
        ticketNumber.toLowerCase().includes(term) ||
        userName.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term)
      );
    });
  }, [tickets, search]);

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-2">
            Support Tickets
          </h1>
          <p className="text-gray-600">Manage customer support tickets.</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Status:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-purple focus:ring-primary-purple">
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Priority:
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-purple focus:ring-primary-purple">
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            Search:
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ticket, subject, user..."
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-purple focus:ring-primary-purple"
            />
          </label>
        </div>
      </div>

      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Loading tickets..." />
          </div>
        ) : (
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
                {filteredTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-8 px-4 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
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
        )}
      </Card>
    </div>
  );
}
