'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { ReportsData } from '@/app/actions/admin/get-reports';

interface Props {
  data: ReportsData;
}

export function ReportsView({ data }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Clearances"
          value={data.totalClearances}
        />
        <MetricCard
          title="Completion Rate"
          value={`${data.overallCompletionRate}%`}
        />
        <MetricCard
          title="Pending"
          value={data.pendingClearances}
          variant="warning"
        />
        <MetricCard
          title="Rejected"
          value={data.rejectedClearances}
          variant="danger"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {data.departmentReports.length > 0 ? (
              <div className="space-y-4">
                {data.departmentReports.map((dept) => (
                  <div key={dept.departmentId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{dept.departmentName}</span>
                      <span className="text-muted-foreground">
                        {dept.completionRate}% ({dept.approvedSteps}/{dept.totalSteps})
                      </span>
                    </div>
                    <Progress value={dept.completionRate} className="h-2" />
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{dept.pendingSteps} pending</span>
                      <span>{dept.approvedSteps} approved</span>
                      <span>{dept.rejectedSteps} rejected</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No department data available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {data.roleDistribution.length > 0 ? (
              <div className="space-y-3">
                {data.roleDistribution.map((item) => {
                  const total = data.roleDistribution.reduce(
                    (sum, r) => sum + r.count,
                    0
                  );
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;

                  return (
                    <div key={item.role} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">
                          {formatRole(item.role)}
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No user data available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Clearance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{data.totalClearances}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {data.approvedClearances}
              </p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {data.pendingClearances}
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {data.rejectedClearances}
              </p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  variant,
}: {
  title: string;
  value: string | number;
  variant?: 'default' | 'warning' | 'danger';
}) {
  const valueColor =
    variant === 'warning'
      ? 'text-amber-600'
      : variant === 'danger'
        ? 'text-red-600'
        : '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function formatRole(role: string): string {
  const labels: Record<string, string> = {
    student: 'Student',
    officer_finance: 'Finance Officer',
    officer_library: 'Library Officer',
    officer_hostel: 'Hostel Officer',
    registrar: 'Registrar',
    admin: 'Admin',
  };
  return labels[role] ?? role;
}
