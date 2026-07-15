'use client';

import { useState } from 'react';

import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/mode-toggle';

import { AdminSidebar } from './admin-sidebar';
import { TabContent } from './tab-content';

import type { AdminView } from '@/types/admin';
import type { OverviewStats } from '@/app/actions/admin/get-overview-stats';

interface Props {
  initialData: {
    overviewStats: OverviewStats;
  };
}

const viewTitles: Record<AdminView, { title: string; description: string }> = {
  overview: {
    title: 'Dashboard Overview',
    description: 'Key metrics and system health at a glance',
  },
  users: {
    title: 'User Management',
    description: 'Manage all system users, roles, and assignments',
  },
  departments: {
    title: 'Department Management',
    description: 'Create and manage university departments',
  },
  reports: {
    title: 'Reports & Analytics',
    description: 'Clearance completion rates and department performance',
  },
  settings: {
    title: 'System Settings',
    description: 'Configure system-wide preferences and policies',
  },
  logs: {
    title: 'System Logs',
    description: 'Monitor all activities and audit events',
  },
};

export function DashboardShell({ initialData }: Props) {
  const [activeTab, setActiveTab] = useState<AdminView>('overview');
  const current = viewTitles[activeTab];

  return (
    <SidebarProvider>
      <AdminSidebar activeTab={activeTab} onChange={setActiveTab} />

      <SidebarInset className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {current.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {current.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </div>

        <div className="space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
          <TabContent activeTab={activeTab} overviewStats={initialData.overviewStats} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
