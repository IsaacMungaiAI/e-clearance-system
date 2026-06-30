'use client';

import { useState } from "react";

import {
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";

import { FinanceSidebar } from "./sidebar";
import { Overview } from "./overview";
import { FeeClearances } from "./fee-clearances";
import { Students } from "./students";
import { Reports } from "./reports";

import type { FinanceView } from "@/types/finance";

interface DashboardData {
    stats: {
        students: number;
        pending: number;
        approved: number;
        rejected: number;
        totalClearances: number;
    };
}

interface Props {
    initialData: DashboardData;
    userName?: string;
    userEmail?: string;
}

export function DashboardShell({
    initialData,
    userName,
    userEmail,
}: Props) {
    const [activeTab, setActiveTab] = useState<FinanceView>("overview");

    return (
        <SidebarProvider>
            <FinanceSidebar
                activeTab={activeTab}
                onChange={setActiveTab}
                userName={userName}
                userEmail={userEmail}
            />

            <SidebarInset className="flex flex-col min-h-screen">
                <div className="flex items-center justify-between mb-6 p-4 sm:p-6 lg:p-8">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-semibold">
                                {activeTab === "overview" && "Overview"}
                                {activeTab === "fee-clearances" && "Fee Clearances"}
                                {activeTab === "students" && "Students"}
                                {activeTab === "reports" && "Reports"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {activeTab === "overview" &&
                                    "Overview of fee clearance statistics"}
                                {activeTab === "fee-clearances" &&
                                    "Review and manage student fee clearance requests"}
                                {activeTab === "students" &&
                                    "View student fee status"}
                                {activeTab === "reports" &&
                                    "Generate financial clearance reports"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                            <Input
                                placeholder="Search students..."
                                className="w-64 lg:w-80"
                            />
                        </div>
                        <ModeToggle />
                        {activeTab === "fee-clearances" && (
                            <Button variant="outline" disabled>
                                Refresh
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-6 px-4 sm:px-6 lg:px-8 pb-8">
                    {activeTab === "overview" && (
                        <Overview stats={initialData.stats} />
                    )}
                    {activeTab === "fee-clearances" && <FeeClearances />}
                    {activeTab === "students" && <Students />}
                    {activeTab === "reports" && <Reports />}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
