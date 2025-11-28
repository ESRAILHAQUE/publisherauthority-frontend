'use client';

import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    { id: 1, title: 'SEO Best Practices Guide', status: 'Pending', deadline: '2025-01-30', earnings: 150, website: 'example-blog.com' },
    { id: 2, title: 'Content Marketing Tips', status: 'Ready To Post', deadline: '2025-01-28', earnings: 120, website: 'tech-insights.net' },
    { id: 3, title: 'Digital Marketing Trends', status: 'Verifying', deadline: '2025-02-01', earnings: 200, website: 'example-blog.com' },
    { id: 4, title: 'Social Media Strategy', status: 'Completed', deadline: '2025-01-20', earnings: 180, website: 'tech-insights.net' },
    { id: 5, title: 'Email Marketing Guide', status: 'Pending', deadline: '2025-02-05', earnings: 160, website: 'example-blog.com' },
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter((o) => o.status === 'Pending').length },
    { id: 'ready', label: 'Ready To Post', count: orders.filter((o) => o.status === 'Ready To Post').length },
    { id: 'verifying', label: 'Verifying', count: orders.filter((o) => o.status === 'Verifying').length },
    { id: 'completed', label: 'Completed', count: orders.filter((o) => o.status === 'Completed').length },
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter((o) => o.status.toLowerCase().replace(' ', '') === activeTab);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Pending': 'default',
      'Ready To Post': 'info',
      'Verifying': 'warning',
      'Completed': 'success',
      'Revision Requested': 'warning',
      'Cancelled': 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Orders</h1>
        <p className="text-gray-600">Manage and track all your orders.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 font-medium transition-colors border-b-2
              ${
                activeTab === tab.id
                  ? 'border-[#3F207F] text-[#3F207F]'
                  : 'border-transparent text-gray-600 hover:text-[#3F207F]'
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Website</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Deadline</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Earnings</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-600">#{order.id}</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{order.title}</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{order.website}</td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusBadge(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{order.deadline}</td>
                  <td className="py-4 px-4 font-semibold text-[#3F207F]">${order.earnings}</td>
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

