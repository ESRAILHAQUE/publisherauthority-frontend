import React from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

export default function WebsitesPage() {
  const websites = [
    {
      id: 1,
      url: 'https://example-blog.com',
      da: 35,
      traffic: 5000,
      status: 'Active',
      verifiedAt: '2025-01-15',
    },
    {
      id: 2,
      url: 'https://tech-insights.net',
      da: 42,
      traffic: 8500,
      status: 'Pending',
      verifiedAt: null,
    },
    {
      id: 3,
      url: 'https://health-tips.org',
      da: 28,
      traffic: 3000,
      status: 'Counter Offer',
      verifiedAt: null,
    },
    {
      id: 4,
      url: 'https://finance-guide.com',
      da: 38,
      traffic: 6000,
      status: 'Rejected',
      verifiedAt: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
      Active: 'success',
      Pending: 'warning',
      'Counter Offer': 'info',
      Rejected: 'danger',
      Deleted: 'default',
    };
    return variants[status] || 'default';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3F207F] mb-2">My Websites</h1>
          <p className="text-gray-600">Manage all your submitted websites.</p>
        </div>
        <Link href="/dashboard/websites/add">
          <Button variant="primary">Add New Website</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Website URL</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">DA Score</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Monthly Traffic</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Verified</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {websites.map((website) => (
                <tr key={website.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <a
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3F207F] hover:text-[#2EE6B7] font-medium"
                    >
                      {website.url}
                    </a>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{website.da}</td>
                  <td className="py-4 px-4 text-gray-700">{website.traffic.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <Badge variant={getStatusBadge(website.status)}>{website.status}</Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {website.verifiedAt ? new Date(website.verifiedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-[#3F207F] hover:text-[#2EE6B7] text-sm font-medium transition-colors">
                        View
                      </button>
                      {website.status === 'Pending' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                          Verify
                        </button>
                      )}
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

