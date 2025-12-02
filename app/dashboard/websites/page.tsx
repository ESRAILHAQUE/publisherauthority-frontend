'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import { websitesApi } from '@/lib/api';
import { WebsiteVerification } from '@/components/websites/WebsiteVerification';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState<any | null>(null);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setLoading(true);
      const data: any = await websitesApi.getWebsites();
      setWebsites(data.websites || data || []);
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (websiteId: string, method: 'tag' | 'article') => {
    try {
      await websitesApi.verifyWebsite(websiteId, method);
      await loadWebsites();
      setSelectedWebsite(null);
    } catch (error: any) {
      alert(error.message || 'Verification failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
      active: 'success',
      pending: 'warning',
      'counter-offer': 'info',
      rejected: 'danger',
      deleted: 'default',
    };
    return variants[statusLower] || 'default';
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading websites...</div>
      </div>
    );
  }

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

      {selectedWebsite && (
        <WebsiteVerification
          website={selectedWebsite}
          onVerify={(method) => handleVerify(selectedWebsite._id, method)}
        />
      )}

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
              {websites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No websites added yet. <Link href="/dashboard/websites/add" className="text-[#3F207F] hover:underline">Add your first website</Link>
                  </td>
                </tr>
              ) : (
                websites.map((website) => (
                  <tr key={website._id || website.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
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
                    <td className="py-4 px-4 text-gray-700">{website.domainAuthority || website.da || '-'}</td>
                    <td className="py-4 px-4 text-gray-700">{(website.monthlyTraffic || website.traffic || 0).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(website.status)}>{formatStatus(website.status)}</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {website.verifiedAt ? new Date(website.verifiedAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setSelectedWebsite(website)}
                          className="text-[#3F207F] hover:text-[#2EE6B7] text-sm font-medium transition-colors"
                        >
                          {website.status === 'pending' ? 'Verify' : 'View'}
                        </button>
                      </div>
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

