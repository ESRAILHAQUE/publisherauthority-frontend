import React from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminApplicationsPage() {
  const applications = [
    { id: 1, name: 'John Doe', email: 'john@example.com', submitted: '2025-01-25', status: 'Pending' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', submitted: '2025-01-24', status: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Publisher Applications</h1>
        <p className="text-gray-600">Review and approve new publisher applications.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Submitted</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{app.name}</td>
                  <td className="py-4 px-4 text-gray-600">{app.email}</td>
                  <td className="py-4 px-4 text-gray-600">{app.submitted}</td>
                  <td className="py-4 px-4">
                    <Badge variant="warning">{app.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Review</Button>
                      <Button variant="primary" size="sm">Approve</Button>
                    </div>
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

