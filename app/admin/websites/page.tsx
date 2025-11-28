import React from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';

export default function AdminWebsitesPage() {
  const websites = [
    { id: 1, url: 'example.com', publisher: 'John Doe', da: 35, traffic: 5000, status: 'Pending' },
    { id: 2, url: 'tech-blog.net', publisher: 'Jane Smith', da: 42, traffic: 8500, status: 'Active' },
    { id: 3, url: 'health-site.org', publisher: 'Mike Johnson', da: 28, traffic: 3000, status: 'Counter Offer' },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': 'success',
      'Pending': 'warning',
      'Counter Offer': 'info',
      'Rejected': 'danger',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Website Management</h1>
        <p className="text-gray-600">Review and manage all submitted websites.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Website URL</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Publisher</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DA</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Traffic</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {websites.map((website) => (
                <tr key={website.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{website.url}</td>
                  <td className="py-4 px-4 text-gray-600">{website.publisher}</td>
                  <td className="py-4 px-4 text-gray-600">{website.da}</td>
                  <td className="py-4 px-4 text-gray-600">{website.traffic.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusBadge(website.status)}>{website.status}</Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Review</Button>
                      <Button variant="ghost" size="sm">Approve</Button>
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

