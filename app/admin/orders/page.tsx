'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { adminApi, ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data: any = await adminApi.getAllOrders();
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRevision = async (orderId: string) => {
    const reason = prompt('Enter revision reason:');
    if (!reason) return;

    try {
      await ordersApi.requestRevision(orderId, reason);
      toast.success('Revision requested successfully');
      await loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to request revision');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;

    try {
      await ordersApi.cancelOrder(orderId, reason);
      toast.success('Order cancelled successfully');
      await loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    if (!confirm('Mark this order as completed?')) return;

    try {
      await ordersApi.completeOrder(orderId);
      toast.success('Order marked as completed');
      await loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Orders Management</h1>
          <p className="text-gray-600">Create and manage all orders.</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/admin/orders/create')}>
          Create New Order
        </Button>
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-600">#{order.orderNumber || order._id?.slice(-8) || order.id}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{order.title || 'Untitled Order'}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.publisherId?.firstName || order.publisher || '-'} {order.publisherId?.lastName || ''}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={
                        order.status === 'completed' ? 'success' : 
                        order.status === 'verifying' ? 'warning' : 
                        order.status === 'ready-to-post' ? 'info' : 
                        'default'
                      }>
                        {order.status?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#3F207F]">${order.earnings || order.amount || 0}</td>
                    <td className="py-4 px-4 relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowActions(showActions === order._id ? null : order._id || order.id)}
                      >
                        Manage
                      </Button>
                      {showActions === (order._id || order.id) && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                router.push(`/admin/orders/${order._id || order.id}`);
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                            {order.status === 'verifying' && (
                              <>
                                <button
                                  onClick={() => {
                                    handleRequestRevision(order._id || order.id);
                                    setShowActions(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50"
                                >
                                  Request Revision
                                </button>
                                <button
                                  onClick={() => {
                                    handleCompleteOrder(order._id || order.id);
                                    setShowActions(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                >
                                  Mark Complete
                                </button>
                              </>
                            )}
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  handleCancelOrder(order._id || order.id);
                                  setShowActions(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      )}
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

