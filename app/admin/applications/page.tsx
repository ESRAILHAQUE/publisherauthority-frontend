'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response: any = await adminApi.getAllApplications({ status: 'pending' });
      // Handle different response structures
      let applicationsData = [];
      if (Array.isArray(response)) {
        applicationsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        applicationsData = response.data;
      } else if (response?.data?.applications && Array.isArray(response.data.applications)) {
        applicationsData = response.data.applications;
      } else if (response?.applications && Array.isArray(response.applications)) {
        applicationsData = response.applications;
      }
      setApplications(applicationsData);
    } catch (error: any) {
      console.error('Failed to load applications:', error);
      toast.error(error.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (appId: string) => {
    try {
      setLoadingDetails(true);
      const response: any = await adminApi.getApplicationById(appId);
      const appData = response?.data?.application || response?.application || response?.data;
      setSelectedApp(appData);
    } catch (error: any) {
      console.error('Failed to load application details:', error);
      toast.error(error.message || 'Failed to load application details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    
    try {
      await adminApi.approveApplication(selectedApp._id || selectedApp.id);
      toast.success('Application approved successfully');
      setSelectedApp(null);
      await loadApplications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve application');
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    try {
      await adminApi.rejectApplication(selectedApp._id || selectedApp.id, rejectionReason);
      toast.success('Application rejected');
      setSelectedApp(null);
      setShowRejectModal(false);
      setRejectionReason('');
      await loadApplications();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject application');
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
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleViewDetails(app._id || app.id)}
                        disabled={loadingDetails}
                      >
                        {loadingDetails ? 'Loading...' : 'View Details'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#3F207F]">
                Application Details - {selectedApp.firstName} {selectedApp.lastName}
              </h2>
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{selectedApp.firstName} {selectedApp.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Country</label>
                    <p className="text-gray-900">{selectedApp.country || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">
                      <Badge variant={selectedApp.status === 'approved' ? 'success' : selectedApp.status === 'rejected' ? 'danger' : 'warning'}>
                        {selectedApp.status?.charAt(0).toUpperCase() + selectedApp.status?.slice(1) || 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted At</label>
                    <p className="text-gray-900">
                      {selectedApp.createdAt || selectedApp.submittedAt
                        ? new Date(selectedApp.createdAt || selectedApp.submittedAt).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* How did you hear about us */}
              {selectedApp.hearAboutUs && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How did you hear about us?</h3>
                  <p className="text-gray-700">{selectedApp.hearAboutUs}</p>
                </div>
              )}

              {/* Guest Post Experience */}
              {selectedApp.guestPostExperience && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Guest Post Experience</h3>
                  <p className="text-gray-700">{selectedApp.guestPostExperience}</p>
                </div>
              )}

              {/* Guest Post URLs */}
              {selectedApp.guestPostUrls && selectedApp.guestPostUrls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Post URLs</h3>
                  <div className="space-y-2">
                    {selectedApp.guestPostUrls.map((url: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{index + 1}.</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Referral Information */}
              {selectedApp.referralInfo && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Referral Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedApp.referralInfo.name && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{selectedApp.referralInfo.name}</p>
                      </div>
                    )}
                    {selectedApp.referralInfo.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <p className="text-gray-900">{selectedApp.referralInfo.email}</p>
                      </div>
                    )}
                    {selectedApp.referralInfo.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{selectedApp.referralInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Answers */}
              {selectedApp.quizAnswers && Object.keys(selectedApp.quizAnswers).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz Answers</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedApp.quizAnswers).map(([key, value]: [string, any]) => {
                      if (!value) return null;
                      const questionNum = key.replace('question', '');
                      
                      // Map question numbers to full questions
                      const questionMap: { [key: string]: string } = {
                        '1': 'How long must articles stay live after you are paid for a job?',
                        '2': 'How long do you have to resolve a link issue before payment penalty is enforced?',
                        '3': 'Where should the articles be placed on your website?',
                        '4': 'What type of link attributes are not allowed for our articles?',
                        '5': 'Where should our articles be published on your website?',
                        '6': 'Which two search engines should the guest post link appear?',
                        '7': 'How long do you have to take most actions once a job is assigned to you?',
                        '8': 'When are payments sent?',
                        '9': 'I hereby attest that all information provided on this application matches the information on my legal identification documents. Please state "I do".',
                      };
                      
                      const fullQuestion = questionMap[questionNum] || `Question ${questionNum}`;
                      
                      return (
                        <div key={key} className="border-l-4 border-[#3F207F] pl-4 py-2">
                          <label className="text-sm font-semibold text-gray-700 block mb-1">
                            Question {questionNum}:
                          </label>
                          <p className="text-sm text-gray-600 mb-2 italic">{fullQuestion}</p>
                          <p className="text-base font-medium text-gray-900">Answer: {value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Uploaded Files */}
              {selectedApp.files && selectedApp.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Uploaded Files</h3>
                  <div className="space-y-2">
                    {selectedApp.files.map((file: any, index: number) => {
                      const isViewable = file.mimetype?.includes('pdf') || file.mimetype?.includes('image');
                      return (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.originalName || file.filename}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.mimetype}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isViewable && (
                                <a
                                  href={file.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 border border-green-600 rounded hover:bg-green-50"
                                >
                                  View
                                </a>
                              )}
                              <a
                                href={file.path}
                                download
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-600 rounded hover:bg-blue-50"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                          {isViewable && (
                            <div className="mt-3 border-t border-gray-200 pt-3">
                              <iframe
                                src={file.path}
                                className="w-full h-96 border border-gray-300 rounded"
                                title={file.originalName || file.filename}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rejection Reason Modal */}
              {showRejectModal && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Rejection Reason</h3>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3F207F] focus:border-transparent"
                    rows={4}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedApp(null);
                    setShowRejectModal(false);
                    setRejectionReason('');
                  }}
                >
                  Close
                </Button>
                {selectedApp.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectModal(!showRejectModal)}
                    >
                      {showRejectModal ? 'Cancel Reject' : 'Reject'}
                    </Button>
                    {showRejectModal ? (
                      <Button
                        variant="outline"
                        onClick={handleReject}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Confirm Reject
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleApprove}
                      >
                        Approve Application
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

