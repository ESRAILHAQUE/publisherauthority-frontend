"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/shared/Card";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { profileApi, dashboardApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    profileImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [stats, setStats] = useState({
    accountLevel: "silver",
    totalOrders: 0,
    totalEarnings: 0,
    activeWebsites: 0,
    joinDate: new Date().toISOString(),
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Fetch profile data
      const profileResponse = (await profileApi.getProfile()) as {
        success?: boolean;
        data?: {
          user?: {
            firstName?: string;
            lastName?: string;
            email?: string;
            country?: string;
            profileImage?: string;
            accountLevel?: string;
            totalEarnings?: number;
            completedOrders?: number;
            activeWebsites?: number;
            createdAt?: string;
            [key: string]: unknown;
          };
        };
        user?: {
          firstName?: string;
          lastName?: string;
          email?: string;
          country?: string;
          profileImage?: string;
          accountLevel?: string;
          totalEarnings?: number;
          completedOrders?: number;
          activeWebsites?: number;
          createdAt?: string;
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };

      // Extract user data from response (backend returns { success: true, data: { user: {...} } })
      const userData =
        profileResponse?.data?.user ||
        profileResponse?.user ||
        (profileResponse as any);

      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        country: userData.country || "",
        profileImage: userData.profileImage || "",
      });

      // Fetch dashboard stats for accurate counts
      try {
        const dashboardResponse = (await dashboardApi.getStats()) as {
          success?: boolean;
          data?: {
            stats?: {
              orders?: {
                completed?: number;
                [key: string]: unknown;
              };
              websites?: {
                active?: number;
                [key: string]: unknown;
              };
              totalEarnings?: number;
              [key: string]: unknown;
            };
            user?: {
              accountLevel?: string;
              [key: string]: unknown;
            };
            [key: string]: unknown;
          };
          stats?: {
            orders?: {
              completed?: number;
              [key: string]: unknown;
            };
            websites?: {
              active?: number;
              [key: string]: unknown;
            };
            totalEarnings?: number;
            [key: string]: unknown;
          };
          user?: {
            accountLevel?: string;
            [key: string]: unknown;
          };
          [key: string]: unknown;
        };

        const dashboardData = dashboardResponse?.data || dashboardResponse;
        const statsData = dashboardData?.stats as {
          orders?: { completed?: number };
          websites?: { active?: number };
          totalEarnings?: number;
        };
        const userDataFromDashboard = dashboardData?.user as {
          accountLevel?: string;
        };

        setStats({
          accountLevel:
            userDataFromDashboard?.accountLevel ||
            userData.accountLevel ||
            "silver",
          totalOrders:
            statsData?.orders?.completed || userData.completedOrders || 0,
          totalEarnings:
            statsData?.totalEarnings || userData.totalEarnings || 0,
          activeWebsites:
            statsData?.websites?.active || userData.activeWebsites || 0,
          joinDate: userData.createdAt || new Date().toISOString(),
        });
      } catch (dashboardError) {
        // If dashboard fails, use user data
        setStats({
          accountLevel: (userData.accountLevel as string) || "silver",
          totalOrders: (userData.completedOrders as number) || 0,
          totalEarnings: (userData.totalEarnings as number) || 0,
          activeWebsites: (userData.activeWebsites as number) || 0,
          joinDate: (userData.createdAt as string) || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    try {
      const response = await profileApi.uploadProfileImage(file);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to upload image" }));
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = (await response.json()) as {
        success?: boolean;
        data?: {
          user?: {
            profileImage?: string;
            [key: string]: unknown;
          };
          profileImage?: string;
          [key: string]: unknown;
        };
        profileImage?: string;
        [key: string]: unknown;
      };

      // Extract profile image URL from response
      const imageUrl =
        data?.data?.profileImage ||
        data?.data?.user?.profileImage ||
        data?.profileImage ||
        "";

      if (imageUrl) {
        setProfileData({ ...profileData, profileImage: imageUrl });
        toast.success("Profile image uploaded successfully");
        // Reload profile to get updated data
        await loadProfile();
      } else {
        throw new Error("Image URL not received");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast.error(errorMessage);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const response = await profileApi.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        country: profileData.country,
      });

      // Handle response properly
      const responseData = response as {
        success?: boolean;
        data?: {
          user?: {
            firstName?: string;
            lastName?: string;
            country?: string;
            [key: string]: unknown;
          };
          [key: string]: unknown;
        };
        [key: string]: unknown;
      };

      if (responseData?.success !== false) {
        toast.success("Profile updated successfully");
        // Reload profile to get updated data
        await loadProfile();
      } else {
        throw new Error("Profile update failed");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Check if current password and new password are the same
    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      errors.newPassword =
        "New password must be different from current password";
    }

    // Check if new password and confirm password match
    if (
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      errors.confirmPassword = "Password does not match";
    }

    setPasswordErrors(errors);
    return (
      !errors.currentPassword && !errors.newPassword && !errors.confirmPassword
    );
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
    // Clear error when user starts typing
    if (passwordErrors[field as keyof typeof passwordErrors]) {
      setPasswordErrors({ ...passwordErrors, [field]: "" });
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (!validatePassword()) {
      return;
    }

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    try {
      await profileApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(errorMessage);
    }
  };

  // Get account level info for badge styling
  const levelInfo = {
    silver: { label: "Silver", variant: "default" as const },
    gold: { label: "Gold", variant: "warning" as const },
    platinum: { label: "Platinum", variant: "success" as const },
  }[stats.accountLevel.toLowerCase()] || {
    label: stats.accountLevel,
    variant: "default" as const,
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-purple mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-purple mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          Profile Information
        </h2>
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-6">
            {profileData.profileImage ? (
              <Image
                src={profileData.profileImage}
                alt="Profile"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-[#3F207F] to-[#2EE6B7] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profileData.firstName?.[0] || "U"}
                {profileData.lastName?.[0] || ""}
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-upload"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}>
                Change Profile Picture
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, GIF or WEBP. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
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
              onChange={(e) =>
                setProfileData({ ...profileData, country: e.target.value })
              }
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            isLoading={saving}
            disabled={saving}>
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Password Change */}
      <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          Change Password
        </h2>
        <div className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              handlePasswordChange("currentPassword", e.target.value)
            }
            error={passwordErrors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => {
              handlePasswordChange("newPassword", e.target.value);
              // Re-validate confirm password when new password changes
              if (
                passwordData.confirmPassword &&
                e.target.value !== passwordData.confirmPassword
              ) {
                setPasswordErrors({
                  ...passwordErrors,
                  confirmPassword: "Password does not match",
                });
              } else if (
                passwordData.confirmPassword &&
                e.target.value === passwordData.confirmPassword
              ) {
                setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
              }
              // Check if new password is same as current
              if (
                passwordData.currentPassword &&
                e.target.value === passwordData.currentPassword
              ) {
                setPasswordErrors({
                  ...passwordErrors,
                  newPassword:
                    "New password must be different from current password",
                });
              } else if (
                passwordData.currentPassword &&
                e.target.value !== passwordData.currentPassword
              ) {
                setPasswordErrors({ ...passwordErrors, newPassword: "" });
              }
            }}
            error={passwordErrors.newPassword}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => {
              handlePasswordChange("confirmPassword", e.target.value);
              // Validate match with new password
              if (
                passwordData.newPassword &&
                e.target.value !== passwordData.newPassword
              ) {
                setPasswordErrors({
                  ...passwordErrors,
                  confirmPassword: "Password does not match",
                });
              } else {
                setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
              }
            }}
            error={passwordErrors.confirmPassword}
          />
          <Button onClick={handleChangePassword}>Update Password</Button>
        </div>
      </Card>

      {/* Account Overview */}
      <Card>
        <h2 className="text-xl font-semibold text-primary-purple mb-6">
          Account Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Account Level</p>
            <Badge
              variant={levelInfo.variant}
              size="md"
              className="text-lg px-4 py-2 capitalize">
              {levelInfo.label}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Orders Completed</p>
            <p className="text-2xl font-bold text-primary-purple">
              {stats.totalOrders}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Earnings</p>
            <p className="text-2xl font-bold text-primary-purple">
              $
              {stats.totalEarnings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Active Websites</p>
            <p className="text-2xl font-bold text-primary-purple">
              {stats.activeWebsites}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Member Since</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(stats.joinDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
