"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import { supportApi } from "@/lib/api";
import { Badge } from "@/components/shared/Badge";
import toast from "react-hot-toast";

interface SupportMessage {
  _id?: string;
  sender?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  } | string;
  message?: string;
  createdAt?: string | Date;
}

interface SupportTicket {
  _id?: string;
  ticketNumber?: string;
  subject?: string;
  status?: string;
  priority?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  messages?: SupportMessage[];
}

export default function DashboardSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      const response = (await supportApi.getTickets()) as {
        data?: { tickets?: SupportTicket[] };
        tickets?: SupportTicket[];
        [key: string]: unknown;
      };
      const data = (response as any)?.data || response;
      const list = Array.isArray(data?.tickets)
        ? data.tickets
        : Array.isArray((data as any))
        ? (data as any)
        : [];
      setTickets(list);
      if (!selectedId && list.length > 0) {
        setSelectedId(String(list[0]._id));
      }
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  const loadTicket = async (id: string) => {
    try {
      setLoadingTicket(true);
      const response = (await supportApi.getTicket(id)) as {
        data?: { ticket?: SupportTicket };
        ticket?: SupportTicket;
        [key: string]: unknown;
      };
      const data = (response as any)?.data || response;
      const ticket = (data as any)?.ticket || data;
      setSelectedTicket(ticket as SupportTicket);
    } catch (error) {
      console.error("Failed to load ticket:", error);
      toast.error("Failed to load ticket");
    } finally {
      setLoadingTicket(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadTicket(selectedId);
    } else {
      setSelectedTicket(null);
    }
  }, [selectedId]);

  const handleSendReply = async () => {
    if (!selectedId || !reply.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    try {
      setSending(true);
      await supportApi.addMessage(selectedId, reply.trim());
      setReply("");
      await loadTicket(selectedId);
      toast.success("Reply sent");
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const statusBadge = useMemo(() => {
    const status = selectedTicket?.status || "";
    switch (status.toLowerCase()) {
      case "open":
        return <Badge variant="info">Open</Badge>;
      case "in-progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "closed":
        return <Badge variant="success">Closed</Badge>;
      default:
        return <Badge variant="default">{status || "Unknown"}</Badge>;
    }
  }, [selectedTicket?.status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-primary-purple">Support</h1>
        <p className="text-gray-600">
          View your support tickets and reply directly if an admin responds.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Tickets</h2>
            {loadingTickets && (
              <span className="text-xs text-gray-500">Loading…</span>
            )}
          </div>
          <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
            {tickets.length === 0 && !loadingTickets && (
              <p className="text-sm text-gray-500">No tickets yet.</p>
            )}
            {tickets.map((ticket) => {
              const isActive = selectedId === ticket._id;
              return (
                <button
                  key={ticket._id}
                  onClick={() => setSelectedId(ticket._id)}
                  className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                    isActive
                      ? "border-primary-purple bg-purple-50"
                      : "border-gray-200 hover:border-primary-purple/60 hover:bg-gray-50"
                  }`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {ticket.subject || "Untitled ticket"}
                    </p>
                    <span className="text-[11px] text-gray-500">
                      {ticket.updatedAt
                        ? new Date(ticket.updatedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 flex items-center gap-2">
                    <Badge variant="info">{ticket.status || "Open"}</Badge>
                    {ticket.ticketNumber && (
                      <span className="text-[11px] text-gray-500">
                        {ticket.ticketNumber}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="h-full">
          {loadingTicket ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Loading ticket…
            </div>
          ) : !selectedTicket ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Select a ticket to view details.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedTicket.ticketNumber}
                  </p>
                </div>
                {statusBadge}
              </div>

              <div className="space-y-3 max-h-[55vh] overflow-auto pr-1">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((msg) => {
                    const senderObj =
                      typeof msg.sender === "string" ? null : msg.sender;
                    const senderName = senderObj
                      ? `${senderObj.firstName || ""} ${senderObj.lastName || ""}`.trim() ||
                        senderObj.role ||
                        "User"
                      : "You";
                    const isAdmin = senderObj?.role === "admin";
                    return (
                      <div
                        key={msg._id || String(msg.createdAt)}
                        className={`rounded-lg border p-3 ${
                          isAdmin
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-slate-200 bg-slate-50"
                        }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <span>{senderName || "User"}</span>
                            <Badge variant={isAdmin ? "success" : "default"} size="sm">
                              {isAdmin ? "Admin" : "You"}
                            </Badge>
                          </div>
                          <span className="text-[11px] text-gray-500">
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No messages yet.</p>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  rows={4}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={handleSendReply}
                    isLoading={sending}
                    disabled={sending}>
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

