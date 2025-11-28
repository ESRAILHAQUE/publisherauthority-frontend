'use client';

import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminOrdersPage() {
  const orders = [
    { id: 1, title: 'SEO Guide', publisher: 'John Doe', status: 'Pending', deadline: '2025-01-30', earnings: 150 },
    { id: 2, title: 'Marketing Tips', publisher: 'Jane Smith', status: 'Verifying', deadline: '2025-01-28', earnings: 120 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Orders Management</h1>
          <p className="text-gray-600">Create and manage all orders.</p>
        </div>
        <Button variant="primary">Create New Order</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Publisher</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Deadline</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Earnings</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600">#{order.id}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{order.title}</td>
                  <td className="py-4 px-4 text-gray-600">{order.publisher}</td>
                  <td className="py-4 px-4">
                    <Badge variant={order.status === 'Completed' ? 'success' : order.status === 'Verifying' ? 'warning' : 'default'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{order.deadline}</td>
                  <td className="py-4 px-4 font-semibold text-[#3F207F]">${order.earnings}</td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">Manage</Button>
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

