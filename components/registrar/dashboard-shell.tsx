'use client';

import { useState } from "react";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { RegistrarSidebar } from "./sidebar";

import { Overview } from "./overview";
import { StudentsTable } from "./students-table";
import { ClearanceTable } from "./clearance-table";
import { Analytics } from "./analytics";
import { Reports } from "./reports";
import { AuditLog } from "./audit-trail";
import CreateUserForm from "./create-user";

import type { RegistrarView } from "@/types/registrar";

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
                        <Overview stats={initialData.stats} />
                    )}

                    {activeTab === "students" && (
                        <StudentsTable />
                    )}

                    {activeTab === "clearances" && (
                        <ClearanceTable />
                    )}

                    {activeTab === "analytics" && (
                        <Analytics />
                    )}

                    {activeTab === "reports" && (
                        <Reports />
                    )}

                    {activeTab === "audit" && (
                        <AuditLog />
                    )}

                    {activeTab === "create-user" && (
                        <CreateUserForm />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}