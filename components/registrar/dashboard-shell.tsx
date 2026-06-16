'use client';

import { useState } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Menu } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { RegistrarSidebar } from "./sidebar";

import { Overview } from "./overview";
import { StudentsTable } from "./students-table";
import { ClearanceTable } from "./clearance-table";
import { Analytics } from "./analytics";
import { Reports } from "./reports";
import { AuditLog } from "./audit-trail";

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
    const [activeTab, setActiveTab] =
        useState<RegistrarView>("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                {/* Sidebar: hidden on small screens, toggled via hamburger */}
                <aside className="hidden md:block">
                    <RegistrarSidebar
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                </aside>

                {/* Mobile sidebar overlay */}
                <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`} aria-hidden={!sidebarOpen}>
                    <div className={`absolute inset-0 bg-black/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
                    <nav className={`absolute left-0 top-0 h-full w-64 bg-white shadow-md transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-4">
                            <RegistrarSidebar activeTab={activeTab} onChange={(t) => { setActiveTab(t); setSidebarOpen(false); }} />
                        </div>
                    </nav>
                </div>

                <main className="flex-1 bg-green-50/50 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <div className="md:hidden">
                            <button aria-label="Open sidebar" className="p-2 rounded-md hover:bg-green-100" onClick={() => setSidebarOpen(true)}>
                                <Menu className="h-5 w-5 text-green-800" />
                            </button>
                        </div>
                        <header className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-green-800">Registrar Dashboard</h1>
                                <p className="text-sm text-green-600">Overview of students and pending clearances</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden md:block">
                                    <Input placeholder="Search students, clearances..." className="w-80" />
                                </div>

                                <Button className="bg-green-600 hover:bg-green-700 text-white">New Clearance</Button>
                            </div>
                        </header>
                    </div>

                    {/* Overview renders stat cards; avoid duplicate cards here */}

                    <div className="rounded-md">
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
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}