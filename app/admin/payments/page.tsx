import React from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminPaymentsPage() {
  const payments = [
    { id: 1, publisher: 'John Doe', amount: 450, status: 'Pending', dueDate: '2025-01-15' },
    { id: 2, publisher: 'Jane Smith', amount: 360, status: 'Processing', dueDate: '2025-01-15' },
  ];

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
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{payment.publisher}</td>
                  <td className="py-4 px-4 font-semibold text-[#3F207F]">${payment.amount}</td>
                  <td className="py-4 px-4 text-gray-600">{payment.dueDate}</td>
                  <td className="py-4 px-4">
                    <Badge variant={payment.status === 'Paid' ? 'success' : payment.status === 'Processing' ? 'info' : 'warning'}>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">Process</Button>
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

