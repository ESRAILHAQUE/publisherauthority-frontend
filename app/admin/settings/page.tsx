'use client';

import React from 'react';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#3F207F] mb-2">Platform Settings</h1>
        <p className="text-gray-600">Manage platform-wide settings and configurations.</p>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">General Settings</h2>
        <div className="space-y-6">
          <Input label="Platform Name" defaultValue="Content Manager" />
          <Input label="Admin Email" type="email" defaultValue="admin@contentmanager.io" />
          <Input label="Support Email" type="email" defaultValue="support@contentmanager.io" />
          <Button>Save Settings</Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-[#3F207F] mb-6">Payment Settings</h2>
        <div className="space-y-6">
          <Input label="Payment Schedule" defaultValue="1st and 15th of each month" />
          <Input label="Minimum Payout" type="number" defaultValue="50" />
          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}

