'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Publisher {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublishers();
  }, []);

  const loadPublishers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDashboard() as { publishers?: Publisher[]; [key: string]: unknown };
      setPublishers(data.publishers || []);
    } catch (error) {
      console.error('Failed to load publishers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLevel = async (userId: string, level: string) => {
    if (!confirm(`Update user level to ${level}?`)) return;

    try {
      await adminApi.updateUserLevel(userId, level);
      toast.success('User level updated successfully');
      await loadPublishers();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user level';
      toast.error(errorMessage);
    }
  };

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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">Loading publishers...</td>
                </tr>
              ) : publishers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">No publishers found</td>
                </tr>
              ) : (
                publishers.map((publisher) => {
                  const level = publisher.accountLevel || publisher.level || 'silver';
                  return (
                    <tr key={publisher._id || publisher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {publisher.firstName || ''} {publisher.lastName || ''} {publisher.name || ''}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{publisher.email}</td>
                      <td className="py-4 px-4">
                        <Badge variant={level === 'premium' ? 'purple' : level === 'gold' ? 'warning' : 'default'}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{publisher.completedOrders || publisher.orders || 0}</td>
                      <td className="py-4 px-4 font-semibold text-[#3F207F]">${(publisher.totalEarnings || publisher.earnings || 0).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <Badge variant="success">{publisher.status || 'Active'}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPublisher(publisher)}>
                          Manage
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

