import React from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminSupportPage() {
  const tickets = [
    { id: 1, subject: 'Payment Issue', user: 'John Doe', status: 'Open', priority: 'High', created: '2025-01-25' },
    { id: 2, subject: 'Account Question', user: 'Jane Smith', status: 'In Progress', priority: 'Medium', created: '2025-01-24' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Support Tickets</h1>
        <p className="text-gray-600">Manage customer support tickets.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Ticket ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600">#{ticket.id}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{ticket.subject}</td>
                  <td className="py-4 px-4 text-gray-600">{ticket.user}</td>
                  <td className="py-4 px-4">
                    <Badge variant={ticket.status === 'Open' ? 'warning' : ticket.status === 'Resolved' ? 'success' : 'info'}>
                      {ticket.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={ticket.priority === 'High' ? 'danger' : 'warning'}>{ticket.priority}</Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{ticket.created}</td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

