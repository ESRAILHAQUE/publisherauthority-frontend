'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { adminApi, websitesApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Website {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllWebsites({}, 1, 50) as { websites?: Website[]; [key: string]: unknown };
      setWebsites(data.websites || []);
    } catch (error) {
      console.error('Failed to load websites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (websiteId: string, method: 'tag' | 'article') => {
    try {
      await websitesApi.verifyWebsite(websiteId, method);
      toast.success('Website verified successfully');
      await loadWebsites();
      setSelectedWebsite(null);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      toast.error(errorMessage);
    }
  };

  const handleUpdateStatus = async (websiteId: string, status: string) => {
    if (status === 'rejected') {
      const reason = prompt('Enter rejection reason:');
      if (!reason) return;
      
      try {
        await adminApi.updateWebsiteStatus(websiteId, status, reason);
        toast.success('Website status updated');
        await loadWebsites();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
        toast.error(errorMessage);
      }
    } else {
      try {
        await adminApi.updateWebsiteStatus(websiteId, status);
        toast.success('Website status updated');
        await loadWebsites();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
        toast.error(errorMessage);
      }
    }
  };

  const handleSendCounterOffer = async (websiteId: string) => {
    const notes = prompt('Enter counter offer notes:');
    if (!notes) return;
    
    const terms = prompt('Enter counter offer terms:');
    if (!terms) return;

    try {
      await adminApi.sendCounterOffer(websiteId, { notes, terms });
      toast.success('Counter offer sent');
      await loadWebsites();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send counter offer';
      toast.error(errorMessage);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
      'active': 'success',
      'pending': 'warning',
      'counter-offer': 'info',
      'rejected': 'danger',
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
              {websites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                    No websites found
                  </td>
                </tr>
              ) : (
                websites.map((website) => (
                  <tr key={website._id || website.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{website.url}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {website.userId?.firstName || ''} {website.userId?.lastName || ''}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{website.domainAuthority || website.da || '-'}</td>
                    <td className="py-4 px-4 text-gray-600">{(website.monthlyTraffic || website.traffic || 0).toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusBadge(website.status)}>{formatStatus(website.status)}</Badge>
                    </td>
                    <td className="py-4 px-4 relative">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowActions(showActions === website._id ? null : website._id || website.id)}
                      >
                        Actions
                      </Button>
                      {showActions === (website._id || website.id) && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setSelectedWebsite(website);
                                setShowActions(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                            {website.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    handleVerify(website._id || website.id, 'tag');
                                    setShowActions(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                >
                                  Verify (HTML Tag)
                                </button>
                                <button
                                  onClick={() => {
                                    handleVerify(website._id || website.id, 'article');
                                    setShowActions(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                                >
                                  Verify (Article)
                                </button>
                                <button
                                  onClick={() => {
                                    handleSendCounterOffer(website._id || website.id);
                                    setShowActions(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                >
                                  Send Counter Offer
                                </button>
                                <button
                                  onClick={() => {
                                    handleUpdateStatus(website._id || website.id, 'rejected');
                                    setShowActions(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {website.status === 'counter-offer' && (
                              <button
                                onClick={() => {
                                  handleUpdateStatus(website._id || website.id, 'active');
                                  setShowActions(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                              >
                                Approve
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

