'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import type { AdminView } from '@/types/admin';
import type { OverviewStats } from '@/app/actions/admin/get-overview-stats';
import type { GetUsersResult } from '@/app/actions/admin/get-users';
import type { DepartmentEntry } from '@/app/actions/admin/get-departments';
import type { ReportsData } from '@/app/actions/admin/get-reports';
import type { SettingsData } from '@/app/actions/admin/get-settings';
import type { GetLogsResult } from '@/app/actions/admin/get-logs';

import { GlassLoading } from '@/components/ui/glass-loading';

import { getUsers } from '@/app/actions/admin/get-users';
import { getDepartments } from '@/app/actions/admin/get-departments';
import { getReports } from '@/app/actions/admin/get-reports';
import { getSettings } from '@/app/actions/admin/get-settings';
import { getLogs } from '@/app/actions/admin/get-logs';

const Overview = dynamic(
  () => import('./overview').then((m) => ({ default: m.Overview })),
  { loading: () => <GlassLoading type="stats" /> }
);

const UsersView = dynamic(
  () => import('./users-view').then((m) => ({ default: m.UsersView })),
  { loading: () => <GlassLoading type="table" /> }
);

const DepartmentsView = dynamic(
  () => import('./departments-view').then((m) => ({ default: m.DepartmentsView })),
  { loading: () => <GlassLoading type="card" count={3} /> }
);

const ReportsView = dynamic(
  () => import('./reports-view').then((m) => ({ default: m.ReportsView })),
  { loading: () => <GlassLoading type="stats" /> }
);

const SettingsView = dynamic(
  () => import('./settings-view').then((m) => ({ default: m.SettingsView })),
  { loading: () => <GlassLoading type="card" /> }
);

const LogsViewer = dynamic(
  () => import('./logs-viewer').then((m) => ({ default: m.LogsViewer })),
  { loading: () => <GlassLoading type="table" /> }
);

interface TabContentProps {
  activeTab: AdminView;
  overviewStats: OverviewStats;
}

export function TabContent({ activeTab, overviewStats }: TabContentProps) {
  return (
    <>
      {activeTab === 'overview' && (
        <Overview stats={overviewStats} />
      )}
      {activeTab !== 'overview' && (
        <LazyTab tab={activeTab} />
      )}
    </>
  );
}

function LazyTab({ tab }: { tab: AdminView }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        let result: any;
        switch (tab) {
          case 'users':
            result = await getUsers({ pageSize: 25 });
            break;
          case 'departments':
            result = await getDepartments();
            break;
          case 'reports':
            result = await getReports();
            break;
          case 'settings':
            result = await getSettings();
            break;
          case 'logs':
            result = await getLogs({ pageSize: 50 });
            break;
          default:
            result = null;
        }
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        console.error(`Failed to load ${tab} data:`, err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [tab]);

  if (loading) {
    const fallbackMap: Record<string, React.ReactNode> = {
      users: <GlassLoading type="table" />,
      departments: <GlassLoading type="card" count={3} />,
      reports: <GlassLoading type="stats" />,
      settings: <GlassLoading type="card" />,
      logs: <GlassLoading type="table" />,
    };
    return fallbackMap[tab] ?? <GlassLoading type="stats" />;
  }

  switch (tab) {
    case 'users':
      return <UsersView initialData={data as GetUsersResult} />;
    case 'departments':
      return <DepartmentsView initialData={data as DepartmentEntry[]} />;
    case 'reports':
      return <ReportsView data={data as ReportsData} />;
    case 'settings':
      return <SettingsView initialData={data as SettingsData} />;
    case 'logs':
      return <LogsViewer initialData={data as GetLogsResult} />;
    default:
      return null;
  }
}
