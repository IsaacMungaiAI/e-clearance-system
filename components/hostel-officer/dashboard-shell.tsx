"use client";

import { ReactNode } from "react";

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";

import { DashboardHeader } from "./dashboard-header";

interface DashboardShellProps {
    sidebar: ReactNode;
    children: ReactNode;

    title: string;
    description?: string;

    userName: string;
    userEmail?: string;
}

export function DashboardShell({
    sidebar,
    children,
    title,
    description,
    userName,
    userEmail,
}: DashboardShellProps) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background text-foreground">
                {sidebar}

                <SidebarInset className="flex min-h-screen flex-1 flex-col bg-muted/30">

                    <DashboardHeader
                        title={title}
                        description={description}
                        userName={userName}
                        userEmail={userEmail}
                    />

                    <main className="flex-1 p-6 lg:p-8">
                        {children}
                    </main>

                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
