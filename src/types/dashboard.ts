'use client';

import type { ReactNode } from 'react';

// Type for the cards at the top of the dashboard
export interface DashboardCard {
  title: string;
  value: string;
  icon: ReactNode;
}

// Type for company data in the table
export interface Company {
  id: string;
  name: string;
  status: "Active" | "Pending" | string; // Allow for other statuses
}

// Type for recent disputes
export interface Dispute {
  id: string;
  renter: string;
  status: "Open" | "Closed" | string;
  createdAt: string;
}

// Type for the logged-in admin user (example)
export interface DashboardUser {
  email: string;
  displayName: string;
  role: "SUPER_ADMIN" | "ADMIN" | "VIEWER";
}

// Type for navigation items (if used elsewhere)
export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}
