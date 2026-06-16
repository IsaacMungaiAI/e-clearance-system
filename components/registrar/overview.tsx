import {
    Users,
    FileClock,
    CheckCircle2,
    Building2,
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
        officers: number;
    };
}

export function Overview({
    stats,
}: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <DashboardCard
                    title="Students"
                    value={stats.students}
                    icon={<Users className="h-5 w-5" />}
                />

                <DashboardCard
                    title="Pending"
                    value={stats.pending}
                    icon={<FileClock className="h-5 w-5" />}
                />

                <DashboardCard
                    title="Approved"
                    value={stats.approved}
                    icon={<CheckCircle2 className="h-5 w-5" />}
                />

                <DashboardCard
                    title="Officers"
                    value={stats.officers}
                    icon={<Building2 className="h-5 w-5" />}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Clearance Overview
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-3">
                        <p>
                            Monitor all pending student
                            clearances from one location.
                        </p>

                        <p>
                            Track Finance, Library and
                            Hostel approvals.
                        </p>
                    </div>
                </CardContent>
            </Card>
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
                <CardTitle className="text-sm">
                    {title}
                </CardTitle>

                {icon}
            </CardHeader>

            <CardContent>
                <p className="text-3xl font-bold">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}