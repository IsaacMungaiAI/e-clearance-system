"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Building2,
    ClipboardList,
    LayoutDashboard,
    Users,
    BedDouble,
    FileBarChart,
    Bell,
    LogOut,
} from "lucide-react";

import { logout } from "@/app/actions/auth/logout";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard/hostel_officer",
    },
    {
        title: "Clearance Requests",
        icon: ClipboardList,
        href: "/dashboard/hostel_officer/requests",
    },
    {
        title: "Residents",
        icon: Users,
        href: "/dashboard/hostel_officer/residents",
    },
    {
        title: "Rooms",
        icon: BedDouble,
        href: "/dashboard/hostel_officer/rooms",
    },
    {
        title: "Reports",
        icon: FileBarChart,
        href: "/dashboard/hostel_officer/reports",
    },
    {
        title: "Notifications",
        icon: Bell,
        href: "/dashboard/hostel_officer/notifications",
    },
];

export function HostelSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
        >
            <SidebarHeader className="border-b">

                <div className="flex items-center gap-3 px-2 py-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">

                        <Building2 className="h-5 w-5 text-white" />

                    </div>

                    <div>

                        <p className="font-semibold">

                            Hostel Portal

                        </p>

                        <p className="text-xs text-muted-foreground">

                            Clearance System

                        </p>

                    </div>

                </div>

            </SidebarHeader>

            <SidebarContent>

                <SidebarGroup>

                    <SidebarGroupLabel>

                        Navigation

                    </SidebarGroupLabel>

                    <SidebarGroupContent>

                        <SidebarMenu>

                            {items.map((item) => (

                                <SidebarMenuItem key={item.href}>

                                    <SidebarMenuButton
                                        render={
                                            <Link href={item.href} />
                                        }
                                        isActive={
                                            pathname === item.href ||
                                            pathname.startsWith(`${item.href}/`)
                                        }
                                    >
                                        <item.icon className="h-4 w-4" />

                                        <span>{item.title}</span>
                                    </SidebarMenuButton>

                                </SidebarMenuItem>

                            ))}

                        </SidebarMenu>

                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter className="border-t">

                <form action={logout}>

                    <SidebarMenuButton
                        type="submit"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                    >

                        <LogOut className="mr-2 h-4 w-4" />

                        Logout

                    </SidebarMenuButton>

                </form>

            </SidebarFooter>

        </Sidebar>
    );
}
