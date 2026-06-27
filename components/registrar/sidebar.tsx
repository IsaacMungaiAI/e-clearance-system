'use client';

import React from 'react';
import {
    LayoutDashboard,
    GraduationCap,
    FileCheck,
    BarChart3,
    FileSpreadsheet,
    ShieldCheck,
    User,
    LogOut,
    UserPlusIcon,
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
} from '@/components/ui/sidebar';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { RegistrarView } from '@/types/registrar';
import { logout } from '@/app/actions/auth/logout';

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
    {
        label: 'Create User',
        value: 'create-user',
        icon: UserPlusIcon,
    },
] as const;

// Mock user for now - you can replace with actual user data from your auth
const user = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: 'Registrar',
    avatar: '',
};

export function RegistrarSidebar({
    activeTab,
    onChange,
}: Props) {
    // Placeholder logout function - you can replace with your actual logout logic
    const handleLogout = () => {
        logout();
        // Add your logout logic here
    };

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Sidebar>
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

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {!mounted ? (
                            <div className="flex items-center gap-2 rounded-md px-2 py-2 cursor-default">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-medium">{user.name}</span>
                                    <span className="text-xs text-sidebar-foreground/70">{user.role}</span>
                                </div>
                            </div>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className="flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium">{user.name}</span>
                                            <span className="text-xs text-sidebar-foreground/70">{user.role}</span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" side="top" className="w-56">
                                    <DropdownMenuContent align="start" side="top" className="w-56">
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" onClick={handleLogout} />
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