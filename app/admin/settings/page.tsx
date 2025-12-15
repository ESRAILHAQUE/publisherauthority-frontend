"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Loader } from "@/components/shared/Loader";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

interface Settings {
  platformName: string;
  adminEmail: string;
  supportEmail: string;
  paymentSchedule: string;
  minimumPayout: number;
  verificationAnchorText?: string;
  verificationLink?: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    platformName: "",
    adminEmail: "",
    supportEmail: "",
    paymentSchedule: "",
    minimumPayout: 50,
    verificationAnchorText: "Publisher Authority",
    verificationLink: "https://publisherauthority.com",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = (await adminApi.getSettings()) as {
        success?: boolean;
        data?: {
          settings?: Settings;
          [key: string]: unknown;
        };
        settings?: Settings;
        [key: string]: unknown;
      };

      const settingsData =
        response?.data?.settings || response?.settings || settings;
      setSettings(settingsData as Settings);
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings({
        platformName: settings.platformName,
        adminEmail: settings.adminEmail,
        supportEmail: settings.supportEmail,
      });
      toast.success("General settings saved successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings({
        paymentSchedule: settings.paymentSchedule,
        minimumPayout: settings.minimumPayout,
      });
      toast.success("Payment settings saved successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVerification = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings({
        verificationAnchorText: settings.verificationAnchorText,
        verificationLink: settings.verificationLink,
      });
      toast.success("Verification settings saved successfully");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save settings";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Platform Settings
        </h1>
        <p className="text-gray-600">
          Manage platform-wide settings and configurations.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" text="Loading settings..." />
        </div>
      ) : (
        <>
          <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          General Settings
        </h2>
        <div className="space-y-6">
          <Input
            label="Platform Name"
            value={settings.platformName}
            onChange={(e) =>
              setSettings({ ...settings, platformName: e.target.value })
            }
          />
          <Input
            label="Admin Email"
            type="email"
            value={settings.adminEmail}
            onChange={(e) =>
              setSettings({ ...settings, adminEmail: e.target.value })
            }
          />
          <Input
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(e) =>
              setSettings({ ...settings, supportEmail: e.target.value })
            }
          />
          <Button onClick={handleSaveGeneral} isLoading={saving}>
            Save Settings
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          Payment Settings
        </h2>
        <div className="space-y-6">
          <Input
            label="Payment Schedule"
            value={settings.paymentSchedule}
            onChange={(e) =>
              setSettings({ ...settings, paymentSchedule: e.target.value })
            }
          />
          <Input
            label="Minimum Payout"
            type="number"
            value={settings.minimumPayout}
            onChange={(e) =>
              setSettings({
                ...settings,
                minimumPayout: Number(e.target.value),
              })
            }
          />
          <Button onClick={handleSavePayment} isLoading={saving}>
            Save Settings
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          Verification Settings
        </h2>
        <div className="space-y-6">
          <Input
            label="Verification Anchor Text"
            value={settings.verificationAnchorText || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                verificationAnchorText: e.target.value,
              })
            }
            helperText="This text must be used as the anchor in the verification article."
          />
          <Input
            label="Verification Link URL"
            type="url"
            value={settings.verificationLink || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                verificationLink: e.target.value,
              })
            }
            helperText="The URL that the anchor should link to (including https://)."
          />
          <Button onClick={handleSaveVerification} isLoading={saving}>
            Save Verification Settings
          </Button>
        </div>
      </Card>
        </>
      )}
    </div>
  );
}
