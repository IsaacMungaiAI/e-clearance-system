'use client';

import React from 'react';
import {
    LayoutDashboard,
    FileCheck,
    FilePlus,
    LogOut,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { logout } from '@/app/actions/auth/logout';

interface Props {
    activeTab: string;
    onChange: (tab: string) => void;
    userName?: string;
    userRole?: string;
    userAvatar?: string;
}

const items = [
    {
        label: 'Overview',
        value: 'overview',
        icon: LayoutDashboard,
    },
    {
        label: 'Apply for Clearance',
        value: 'apply',
        icon: FilePlus,
    },
    {
        label: 'Clearances',
        value: 'clearances',
        icon: FileCheck,
    },
] as const;

export function StudentSidebar({
    activeTab,
    onChange,
    userName = 'Jane Doe',
    userRole = 'Student',
    userAvatar = '',
}: Props) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        // Add your logout logic here
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.value}>
                            <SidebarMenuButton
                                isActive={activeTab === item.value}
                                onClick={() => onChange(item.value)}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                {!mounted ? (
                    <div className="flex items-center gap-2 rounded-md px-2 py-2 w-full">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-medium">{userName}</span>
                            <span className="text-xs text-sidebar-foreground/70">{userRole}</span>
                        </div>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className="flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={userAvatar} alt={userName} />
                                    <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">{userName}</span>
                                    <span className="text-xs text-sidebar-foreground/70">{userRole}</span>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="top" className="w-56">
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
