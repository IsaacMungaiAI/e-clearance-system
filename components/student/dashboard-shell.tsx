'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Input } from '@/components/ui/input';
import { StudentSidebar } from './sidebar';
import { GlassLoading } from '@/components/ui/glass-loading';

const OverviewContent = dynamic(
    () => import('./overview-content').then((m) => ({ default: m.OverviewContent })),
    { loading: () => <GlassLoading type="stats" /> }
);

const ApplyForClearance = dynamic(
    () => import('./apply-clearance').then((m) => ({ default: m.ApplyForClearance })),
    { loading: () => <GlassLoading type="card" /> }
);

const ClearancesContent = dynamic(
    () => import('./clearances-content').then((m) => ({ default: m.ClearancesContent })),
    { loading: () => <GlassLoading type="list" /> }
);

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
                            <Suspense fallback={<GlassLoading type="stats" />}>
                                <OverviewContent steps={initialData.steps} />
                            </Suspense>
                        )}

                        {activeTab === 'apply' && (
                            <Suspense fallback={<GlassLoading type="card" />}>
                                <ApplyForClearance />
                            </Suspense>
                        )}

                        {activeTab === 'clearances' && (
                            <Suspense fallback={<GlassLoading type="list" />}>
                                <ClearancesContent steps={initialData.steps} />
                            </Suspense>
                        )}
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
