"use client";

import {
    Bell,
    Search,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import {
    SidebarTrigger,
} from "@/components/ui/sidebar";

import {
    Button,
} from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
    title: string;
    description?: string;

    userName: string;
    userEmail?: string;
}

export function DashboardHeader({
    title,
    description,
    userName,
    userEmail,
}: DashboardHeaderProps) {
    const initials = userName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">

            <div className="flex h-16 items-center justify-between px-6">

                {/* Left */}

                <div className="flex items-center gap-4">

                    <SidebarTrigger />

                    <Separator
                        orientation="vertical"
                        className="h-6"
                    />

                    <div>

                        <h1 className="text-xl font-semibold tracking-tight">
                            {title}
                        </h1>

                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}

                    </div>

                </div>

                {/* Right */}

                <div className="flex items-center gap-4">

                    <div className="relative hidden md:block">

                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search..."
                            className="w-72 pl-10"
                        />

                    </div>

                    <Button
                        size="icon"
                        variant="ghost"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3">

                        <Avatar>

                            <AvatarFallback>

                                {initials}

                            </AvatarFallback>

                        </Avatar>

                        <div className="hidden md:block">

                            <p className="text-sm font-medium">

                                {userName}

                            </p>

                            <p className="text-xs text-muted-foreground">

                                {userEmail}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}