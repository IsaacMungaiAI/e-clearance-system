'use client';

import { useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StudentSidebar } from './sidebar';
import { ApplyForClearance } from './apply-clearance';

interface DashboardData {
    steps: any[];
}

interface Props {
    initialData: DashboardData;
    userName?: string;
}

export function StudentDashboardShell({ initialData, userName }: Props) {
    const [activeTab, setActiveTab] = useState<string>('overview');
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background text-foreground">
                <StudentSidebar
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    userName={userName}
                />
                <SidebarInset className="flex flex-col min-h-screen">
                    <div className="flex items-center justify-between mb-6 p-4 sm:p-6 lg:p-8">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-semibold">Student Dashboard</h1>
                                <p className="text-sm text-muted-foreground">
                                    {activeTab === 'overview' && 'Track your clearance progress'}
                                    {activeTab === 'apply' && 'Submit your clearance application'}
                                    {activeTab === 'clearances' && 'View your clearance details'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block">
                                <Input placeholder="Search..." className="w-64 lg:w-80" />
                            </div>
                            <ModeToggle />
                        </div>
                    </div>

                    <div className="space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
                        {activeTab === 'overview' && (
                            <OverviewContent steps={initialData.steps} />
                        )}

                        {activeTab === 'apply' && (
                            <ApplyForClearance />
                        )}

                        {activeTab === 'clearances' && (
                            <ClearancesContent steps={initialData.steps} />
                        )}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

function OverviewContent({ steps }: { steps: any[] }) {
    const total = steps.length || 0;
    const approved = steps.filter((s) => s.status === 'approved').length || 0;
    const pending = steps.filter((s) => s.status === 'pending').length || 0;
    const rejected = steps.filter((s) => s.status === 'rejected').length || 0;
    const progress = total ? (approved / total) * 100 : 0;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                        <p className="text-xs text-muted-foreground">Departments to clear</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{approved}</div>
                        <p className="text-xs text-muted-foreground">Departments cleared</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{pending}</div>
                        <p className="text-xs text-muted-foreground">Departments pending</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Clearance Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">
                        {approved} of {total} departments cleared ({Math.round(progress)}%)
                    </p>
                    {progress === 100 && (
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-300">
                            <p className="font-semibold">🎉 Clearance Complete!</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Department Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-medium">
                                    {step.departments?.[0]?.name || 'Unknown Department'}
                                </p>
                                {step.comment && (
                                    <p className="text-sm text-muted-foreground">
                                        {step.comment}
                                    </p>
                                )}
                            </div>
                            <StatusBadge status={step.status} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
}

function ClearancesContent({ steps }: { steps: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Clearance Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="p-4 border rounded-lg"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium">
                                        {step.departments?.[0]?.name || 'Unknown Department'}
                                    </h3>
                                    <StatusBadge status={step.status} />
                                </div>
                            </div>
                            {step.comment && (
                                <div className="mt-2 p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">Comment:</span> {step.comment}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge variant={
            status === 'approved' ? 'default' :
                status === 'pending' ? 'secondary' : 'destructive'
        }>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
