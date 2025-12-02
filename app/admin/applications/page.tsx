'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { adminApi, applicationsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data: any = await applicationsApi.getApplications({ status: 'pending' });
      setApplications(Array.isArray(data) ? data : (data.applications || []));
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (appId: string, decision: 'approve' | 'reject') => {
    if (decision === 'reject') {
      const notes = prompt('Enter rejection reason (optional):');
      if (notes === null) return; // User cancelled
      
      try {
        await applicationsApi.reviewApplication(appId, decision, notes);
        toast.success('Application rejected');
        await loadApplications();
      } catch (error: any) {
        toast.error(error.message || 'Failed to review application');
      }
    } else {
      if (!confirm('Approve this application?')) return;
      
      try {
        await applicationsApi.reviewApplication(appId, decision);
        toast.success('Application approved');
        await loadApplications();
      } catch (error: any) {
        toast.error(error.message || 'Failed to review application');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Publisher Applications</h1>
        <p className="text-gray-600">Review and approve new publisher applications.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Submitted</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                    No pending applications
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id || app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">{app.email}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                        {app.status?.charAt(0).toUpperCase() + app.status?.slice(1) || 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                        >
                          Review
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleReview(app._id || app.id, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReview(app._id || app.id, 'reject')}
                        >
                          Reject
                        </Button>
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

