'use client';

import {
  Users,
  GraduationCap,
  Shield,
  Building2,
  FileClock,
  CheckCircle2,
  XCircle,
  Activity,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { OverviewStats } from '@/app/actions/admin/get-overview-stats';

interface Props {
  stats: OverviewStats;
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

const roleLabels: Record<string, string> = {
  student: 'Students',
  officer_finance: 'Finance Officers',
  officer_library: 'Library Officers',
  officer_hostel: 'Hostel Officers',
  registrar: 'Registrars',
  admin: 'Admins',
};

export function Overview({ stats }: Props) {
  const totalClearances =
    stats.pendingClearances +
    stats.approvedClearances +
    stats.rejectedClearances;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Students"
          value={stats.totalStudents}
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          title="Departments"
          value={stats.totalDepartments}
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          title="Officers"
          value={stats.totalOfficers}
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending Clearances"
          value={stats.pendingClearances}
          icon={<FileClock className="h-5 w-5" />}
        />
        <StatCard
          title="Approved Clearances"
          value={stats.approvedClearances}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          title="Rejected Clearances"
          value={stats.rejectedClearances}
          icon={<XCircle className="h-5 w-5" />}
        />
        <StatCard
          title="Activities (7d)"
          value={stats.recentActivityCount}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clearance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalClearances > 0 ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium">
                    {Math.round((stats.approvedClearances / totalClearances) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.round(
                        (stats.approvedClearances / totalClearances) * 100
                      )}%`,
                    }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="font-medium text-amber-600">{stats.pendingClearances}</p>
                    <p className="text-muted-foreground">Pending</p>
                  </div>
                  <div>
                    <p className="font-medium text-emerald-600">{stats.approvedClearances}</p>
                    <p className="text-muted-foreground">Approved</p>
                  </div>
                  <div>
                    <p className="font-medium text-red-600">{stats.rejectedClearances}</p>
                    <p className="text-muted-foreground">Rejected</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No clearance data yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentRegistrations.length > 0 ? (
              <div className="space-y-3">
                {stats.recentRegistrations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{user.fullName ?? 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {roleLabels[user.role ?? ''] ?? user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent registrations.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
