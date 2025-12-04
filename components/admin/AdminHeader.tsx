"use client";

import React from "react";
import { NotificationDropdown } from "./NotificationDropdown";

export const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};

