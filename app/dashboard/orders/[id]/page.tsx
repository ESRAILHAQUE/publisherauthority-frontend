'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Textarea } from '@/components/shared/Textarea';
import { ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    articleUrl: '',
    notes: '',
  });

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data: any = await ordersApi.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionData.articleUrl) {
      toast.error('Please provide the article URL');
      return;
    }

    try {
      setSubmitting(true);
      await ordersApi.submitOrder(orderId, {
        submissionUrl: submissionData.articleUrl,
        submissionNotes: submissionData.notes,
      });
      toast.success('Order submitted successfully!');
      await loadOrder();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Button onClick={() => router.push('/dashboard/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  const canSubmit = order.status === 'ready-to-post' || order.status === 'pending';
  const isCompleted = order.status === 'completed';
  const isVerifying = order.status === 'verifying';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.push('/dashboard/orders')}>
            ← Back to Orders
          </Button>
          <h1 className="text-3xl font-bold text-[#3F207F] mt-4 mb-2">
            Order #{order.orderNumber || order._id?.slice(-8)}
          </h1>
          <p className="text-gray-600">{order.title || 'Untitled Order'}</p>
        </div>
        <Badge
          variant={
            order.status === 'completed'
              ? 'success'
              : order.status === 'ready-to-post'
              ? 'info'
              : order.status === 'verifying'
              ? 'warning'
              : 'default'
          }
          size="md"
        >
          {order.status?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-[#3F207F] mb-4">Order Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-medium">{order.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Website</p>
                <p className="font-medium">{order.websiteId?.url || order.website || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-medium">
                  {order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="font-semibold text-[#3F207F] text-lg">${order.earnings || order.amount || 0}</p>
              </div>
              {order.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-700">{order.description}</p>
                </div>
              )}
              {order.requirements && (
                <div>
                  <p className="text-sm text-gray-600">Requirements</p>
                  <div className="text-gray-700 whitespace-pre-line">{order.requirements}</div>
                </div>
              )}
            </div>
          </Card>

          {/* Submission Form */}
          {canSubmit && !isCompleted && (
            <Card>
              <h2 className="text-xl font-semibold text-[#3F207F] mb-4">Submit Order</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Article URL"
                  type="url"
                  value={submissionData.articleUrl}
                  onChange={(e) => setSubmissionData({ ...submissionData, articleUrl: e.target.value })}
                  placeholder="https://example.com/article"
                  required
                />
                <Textarea
                  label="Notes (Optional)"
                  value={submissionData.notes}
                  onChange={(e) => setSubmissionData({ ...submissionData, notes: e.target.value })}
                  rows={4}
                  placeholder="Any additional notes..."
                />
                <Button type="submit" isLoading={submitting} disabled={submitting}>
                  Submit Order
                </Button>
              </form>
            </Card>
          )}

          {/* Submission Info */}
          {isVerifying || isCompleted ? (
            <Card>
              <h2 className="text-xl font-semibold text-[#3F207F] mb-4">Submission Details</h2>
              {order.submittedUrl && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Article URL</p>
                    <a
                      href={order.submittedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3F207F] hover:underline"
                    >
                      {order.submittedUrl}
                    </a>
                  </div>
                  {order.submittedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Submitted At</p>
                      <p className="text-gray-700">
                        {new Date(order.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {order.submissionNotes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-700">{order.submissionNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant={order.status === 'completed' ? 'success' : 'default'}>
                  {order.status?.replace('-', ' ')}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

