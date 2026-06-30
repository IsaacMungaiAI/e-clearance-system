'use client';

import { useState } from 'react';
import {
    Download,
    FileText,
    BarChart3,
    Users,
    DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const reportTemplates = [
    {
        id: 'fee-clearance-summary',
        title: 'Fee Clearance Summary',
        description: 'Overview of all fee clearance requests with status breakdown.',
        icon: BarChart3,
        badge: 'Summary',
    },
    {
        id: 'pending-fees',
        title: 'Pending Fee Clearances',
        description: 'List of all students with pending fee clearance requests.',
        icon: Users,
        badge: 'Pending',
    },
    {
        id: 'cleared-students',
        title: 'Cleared Students Report',
        description: 'Students who have completed their fee clearance.',
        icon: DollarSign,
        badge: 'Cleared',
    },
    {
        id: 'fee-audit-trail',
        title: 'Fee Audit Trail',
        description: 'Historical log of all fee clearance actions taken.',
        icon: FileText,
        badge: 'Audit',
    },
];

export function Reports() {
    const [period, setPeriod] = useState('all');
    const [generating, setGenerating] = useState<string | null>(null);

    const handleGenerate = async (reportId: string) => {
        setGenerating(reportId);
        try {
            const res = await fetch(
                `/api/finance-officer/reports/${reportId}?period=${period}`
            );
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? 'Failed to generate report');
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportId}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success('Report downloaded successfully');
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Generate Reports</h2>
                    <p className="text-sm text-muted-foreground">
                        Download financial clearance reports for your records.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Period:
                    </span>
                    <Select value={period} onValueChange={(val) => val && setPeriod(val)}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="semester">Semester</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {reportTemplates.map((report) => (
                    <Card key={report.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <report.icon className="h-5 w-5 text-emerald-600" />
                                        {report.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {report.description}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline">{report.badge}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => handleGenerate(report.id)}
                                disabled={generating === report.id}
                                className="w-full"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                {generating === report.id
                                    ? 'Generating…'
                                    : 'Download Report'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
