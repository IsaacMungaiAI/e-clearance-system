'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Settings,
  ScrollText,
  LogOut,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/app/actions/auth/logout';

import type { AdminView } from '@/types/admin';

interface Props {
  activeTab: AdminView;
  onChange: (tab: AdminView) => void;
}

const items = [
  {
    label: 'Overview',
    value: 'overview' as AdminView,
    icon: LayoutDashboard,
  },
  {
    label: 'Users',
    value: 'users' as AdminView,
    icon: Users,
  },
  {
    label: 'Departments',
    value: 'departments' as AdminView,
    icon: Building2,
  },
  {
    label: 'Reports',
    value: 'reports' as AdminView,
    icon: BarChart3,
  },
  {
    label: 'Settings',
    value: 'settings' as AdminView,
    icon: Settings,
  },
  {
    label: 'System Logs',
    value: 'logs' as AdminView,
    icon: ScrollText,
  },
];

const user = {
  name: 'Admin',
  email: 'admin@university.edu',
  role: 'Administrator',
  avatar: '',
};

export function AdminSidebar({ activeTab, onChange }: Props) {
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
                    onClick={() => onChange(item.value)}
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
                  <AvatarFallback>
                    {user.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {user.role}
                  </span>
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer w-full hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-sidebar-foreground/70">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-56">
                  <DropdownMenuSeparator />
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
