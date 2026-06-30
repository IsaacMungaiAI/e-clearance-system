'use client';

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { RegistrarSidebar } from "./sidebar";

import type { RegistrarView } from "@/types/registrar";
import { GlassLoading } from "@/components/ui/glass-loading";

const Overview = dynamic(
    () => import("./overview").then((m) => ({ default: m.Overview })),
    { loading: () => <GlassLoading type="stats" /> }
);

const StudentsTable = dynamic(
    () => import("./students-table").then((m) => ({ default: m.StudentsTable })),
    { loading: () => <GlassLoading type="table" /> }
);

const ClearanceTable = dynamic(
    () => import("./clearance-table").then((m) => ({ default: m.ClearanceTable })),
    { loading: () => <GlassLoading type="table" /> }
);

const Analytics = dynamic(
    () => import("./analytics").then((m) => ({ default: m.Analytics })),
    { loading: () => <GlassLoading type="stats" /> }
);

const Reports = dynamic(
    () => import("./reports").then((m) => ({ default: m.Reports })),
    { loading: () => <GlassLoading type="card" count={2} /> }
);

const AuditLog = dynamic(
    () => import("./audit-trail").then((m) => ({ default: m.AuditLog })),
    { loading: () => <GlassLoading type="list" /> }
);

const CreateUserForm = dynamic(
    () => import("./create-user"),
    { loading: () => <GlassLoading type="card" /> }
);

interface DashboardData {
    stats: {
        students: number;
        pending: number;
        approved: number;
        officers: number;
    };
}

interface Props {
    initialData: DashboardData;
}

export function DashboardShell({
    initialData,
}: Props) {
    const [activeTab, setActiveTab] = useState<RegistrarView>("overview");

    return (
        <SidebarProvider>
            <RegistrarSidebar
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            <SidebarInset className="flex flex-col min-h-screen">
                <div className="flex items-center justify-between mb-6 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold">
                                {activeTab === "overview" && "Overview"}
                                {activeTab === "students" && "Students"}
                                {activeTab === "clearances" && "Clearances"}
                                {activeTab === "analytics" && "Analytics"}
                                {activeTab === "reports" && "Reports"}
                                {activeTab === "audit" && "Audit Trail"}
                                {activeTab === "create-user" && "Create User"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {activeTab === "overview" && "Overview of students and pending clearances"}
                                {activeTab === "students" && "Manage all students"}
                                {activeTab === "clearances" && "View and manage clearances"}
                                {activeTab === "analytics" && "Clearance analytics"}
                                {activeTab === "reports" && "Generate reports"}
                                {activeTab === "audit" && "Audit trail of actions"}
                                {activeTab === "create-user" && "Create new system users"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                            <Input placeholder="Search students, clearances..." className="w-64 lg:w-80" />
                        </div>

                        <ModeToggle />
                        {activeTab !== "create-user" && <Button>New Clearance</Button>}
                    </div>
                </div>

                <div className="space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
                    {activeTab === "overview" && (
                        <Suspense fallback={<GlassLoading type="stats" />}>
                            <Overview stats={initialData.stats} />
                        </Suspense>
                    )}

                    {activeTab === "students" && (
                        <Suspense fallback={<GlassLoading type="table" />}>
                            <StudentsTable />
                        </Suspense>
                    )}

                    {activeTab === "clearances" && (
                        <Suspense fallback={<GlassLoading type="table" />}>
                            <ClearanceTable />
                        </Suspense>
                    )}

                    {activeTab === "analytics" && (
                        <Suspense fallback={<GlassLoading type="stats" />}>
                            <Analytics />
                        </Suspense>
                    )}

                    {activeTab === "reports" && (
                        <Suspense fallback={<GlassLoading type="card" count={2} />}>
                            <Reports />
                        </Suspense>
                    )}

                    {activeTab === "audit" && (
                        <Suspense fallback={<GlassLoading type="list" />}>
                            <AuditLog />
                        </Suspense>
                    )}

                    {activeTab === "create-user" && (
                        <Suspense fallback={<GlassLoading type="card" />}>
                            <CreateUserForm />
                        </Suspense>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
