'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data: any = await adminApi.getDashboard();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (paymentId: string) => {
    if (!confirm('Process this payment?')) return;

    try {
      await adminApi.processPayment(paymentId);
      toast.success('Payment processed successfully');
      await loadPayments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Payment Management</h1>
        <p className="text-gray-600">Process and manage all payments.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Publisher</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">No payments found</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id || payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {payment.userId?.firstName || ''} {payment.userId?.lastName || ''} {payment.publisher || ''}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#3F207F]">${payment.amount || 0}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'processing' ? 'info' : 'warning'}>
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1) || 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {payment.status !== 'paid' && (
                        <Button variant="ghost" size="sm" onClick={() => handleProcessPayment(payment._id || payment.id)}>
                          Process
                        </Button>
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

