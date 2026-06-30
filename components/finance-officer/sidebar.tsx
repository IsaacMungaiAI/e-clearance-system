'use client';

import React from 'react';
import {
    LayoutDashboard,
    FileCheck,
    GraduationCap,
    FileSpreadsheet,
    LogOut,
    Wallet,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { FinanceView } from '@/types/finance';
import { logout } from '@/app/actions/auth/logout';

interface Props {
    activeTab: FinanceView;
    onChange: (tab: FinanceView) => void;
    userName?: string;
    userEmail?: string;
}

const items = [
    {
        label: 'Overview',
        value: 'overview' as const,
        icon: LayoutDashboard,
    },
    {
        label: 'Fee Clearances',
        value: 'fee-clearances' as const,
        icon: FileCheck,
    },
    {
        label: 'Students',
        value: 'students' as const,
        icon: GraduationCap,
    },
    {
        label: 'Reports',
        value: 'reports' as const,
        icon: FileSpreadsheet,
    },
];

export function FinanceSidebar({
    activeTab,
    onChange,
    userName,
    userEmail,
}: Props) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const initials = userName
        ? userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
        : "FO";

    const displayName = userName ?? "Finance Officer";
    const displayEmail = userEmail ?? "finance@kafu.ac.ke";

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex items-center gap-3 px-2 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold">Finance Portal</p>
                        <p className="text-xs text-muted-foreground">
                            Clearance System
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.value}>
                                    <SidebarMenuButton
                                        isActive={activeTab === item.value}
                                        onClick={() =>
                                            onChange(item.value)
                                        }
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        {!mounted ? (
                            <div className="flex items-center gap-2 rounded-md px-2 py-2 cursor-default">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">{displayName}</span>
                                    <span className="text-xs text-sidebar-foreground/70">Finance Officer</span>
                                </div>
                            </div>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className="flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{initials}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium">{displayName}</span>
                                            <span className="text-xs text-sidebar-foreground/70">Finance Officer</span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" side="top" className="w-56">
                                    <DropdownMenuItem
                                        onClick={() => logout()}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
