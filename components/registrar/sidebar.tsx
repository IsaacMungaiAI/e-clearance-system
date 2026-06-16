'use client';

import {
    LayoutDashboard,
    GraduationCap,
    FileCheck,
    BarChart3,
    FileSpreadsheet,
    ShieldCheck,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';

import { RegistrarView } from '@/types/registrar';

interface Props {
    activeTab: RegistrarView;
    onChange: (tab: RegistrarView) => void;
}

const items = [
    {
        label: 'Overview',
        value: 'overview',
        icon: LayoutDashboard,
    },
    {
        label: 'Students',
        value: 'students',
        icon: GraduationCap,
    },
    {
        label: 'Clearances',
        value: 'clearances',
        icon: FileCheck,
    },
    {
        label: 'Analytics',
        value: 'analytics',
        icon: BarChart3,
    },
    {
        label: 'Reports',
        value: 'reports',
        icon: FileSpreadsheet,
    },
    {
        label: 'Audit Trail',
        value: 'audit',
        icon: ShieldCheck,
    },
] as const;

export function RegistrarSidebar({
    activeTab,
    onChange,
}: Props) {
    return (
        <Sidebar>
            <SidebarContent>
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
            </SidebarContent>
        </Sidebar>
    );
}