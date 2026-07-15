import { DashboardShell } from '@/components/admin/dashboard-shell';
import { getOverviewStats } from '@/app/actions/admin/get-overview-stats';

export default async function AdminPage() {
  const overviewStats = await getOverviewStats();

  return (
    <DashboardShell
      initialData={{
        overviewStats,
      }}
    />
  );
}
