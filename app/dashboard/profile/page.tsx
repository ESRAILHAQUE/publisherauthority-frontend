'use client';

import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/shared/Badge';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    country: 'United States',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const stats = {
    accountLevel: 'Gold',
    totalOrders: 45,
    totalEarnings: 12500.00,
    activeWebsites: 8,
    joinDate: '2024-01-15',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences.</p>
      </div>

      {/* Profile Information */}
      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">Profile Information</h2>
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              JD
            </div>
            <div>
              <Button variant="outline" size="sm">Change Profile Picture</Button>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
            />
            <Input
              label="Email Address"
              value={profileData.email}
              disabled
              helperText="Email cannot be changed after signup"
            />
            <Input
              label="Country"
              value={profileData.country}
              disabled
            />
          </div>

          <Button>Save Changes</Button>
        </div>
      </Card>

      {/* Password Change */}
      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">Change Password</h2>
        <div className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
          />
          <Button>Update Password</Button>
        </div>
      </Card>

      {/* Account Overview */}
      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Account Level</p>
            <Badge variant="warning" size="md" className="text-lg px-4 py-2">
              {stats.accountLevel}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Orders Completed</p>
            <p className="text-2xl font-bold text-[#3F207F]">{stats.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
            <p className="text-2xl font-bold text-[#3F207F]">${stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Active Websites</p>
            <p className="text-2xl font-bold text-[#3F207F]">{stats.activeWebsites}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Member Since</p>
            <p className="text-lg font-semibold text-gray-900">{new Date(stats.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

