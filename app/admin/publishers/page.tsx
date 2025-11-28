import React from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminPublishersPage() {
  const publishers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', level: 'Gold', orders: 45, earnings: 12500, status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', level: 'Silver', orders: 25, earnings: 6500, status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', level: 'Premium', orders: 150, earnings: 35000, status: 'Active' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Manage Publishers</h1>
        <p className="text-gray-600">View and manage all publishers on the platform.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Level</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Orders</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Earnings</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((publisher) => (
                <tr key={publisher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{publisher.name}</td>
                  <td className="py-4 px-4 text-gray-600">{publisher.email}</td>
                  <td className="py-4 px-4">
                    <Badge variant={publisher.level === 'Premium' ? 'purple' : publisher.level === 'Gold' ? 'warning' : 'default'}>
                      {publisher.level}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{publisher.orders}</td>
                  <td className="py-4 px-4 font-semibold text-[#3F207F]">${publisher.earnings.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <Badge variant="success">{publisher.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">View Details</Button>
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

