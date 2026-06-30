import {
    Users,
    FileClock,
    CheckCircle2,
    XCircle,
    FileText,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Props {
    stats: {
        students: number;
        pending: number;
        approved: number;
        rejected: number;
        totalClearances: number;
    };
}

export function Overview({
    stats,
}: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                <DashboardCard
                    title="Total Students"
                    value={stats.students}
                    icon={<Users className="h-5 w-5" />}
                />
                <DashboardCard
                    title="Pending Fees"
                    value={stats.pending}
                    icon={<FileClock className="h-5 w-5" />}
                />
                <DashboardCard
                    title="Cleared Fees"
                    value={stats.approved}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                />
                <DashboardCard
                    title="Rejected Fees"
                    value={stats.rejected}
                    icon={<XCircle className="h-5 w-5" />}
                />
                <DashboardCard
                    title="Total Clearances"
                    value={stats.totalClearances}
                    icon={<FileText className="h-5 w-5" />}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Fee Clearance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                Review and manage student fee clearance requests.
                                Approve or reject based on payment status.
                            </p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <span className="font-medium text-foreground">{stats.pending}</span> pending fee verifications
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">{stats.approved}</span> cleared students
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">{stats.rejected}</span> rejected applications
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>Navigate to the relevant section to perform actions:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>
                                    <span className="font-medium text-foreground">Fee Clearances</span> &mdash; Review and process pending fee clearance requests
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">Students</span> &mdash; Search and view student fee status
                                </li>
                                <li>
                                    <span className="font-medium text-foreground">Reports</span> &mdash; Generate financial clearance reports
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DashboardCard({
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
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}
