"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: number | string;

    icon: LucideIcon;

    description?: string;

    trend?: {
        value: string;
        positive: boolean;
    };

    color?:
    | "emerald"
    | "blue"
    | "amber"
    | "red"
    | "purple";
}

const colors = {
    emerald: {
        bg: "bg-emerald-50",
        icon: "text-emerald-600",
        border: "border-emerald-100",
    },

    blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        border: "border-blue-100",
    },

    amber: {
        bg: "bg-amber-50",
        icon: "text-amber-600",
        border: "border-amber-100",
    },

    red: {
        bg: "bg-red-50",
        icon: "text-red-600",
        border: "border-red-100",
    },

    purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        border: "border-purple-100",
    },
};

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = "emerald",
}: StatsCardProps) {
    const theme = colors[color];

    return (
        <Card
            className={cn(
                "transition-all duration-300 hover:shadow-lg",
                theme.border
            )}
        >
            <CardContent className="p-6">

                <div className="flex items-start justify-between">

                    <div className="space-y-2">

                        <p className="text-sm text-muted-foreground">
                            {title}
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight">
                            {value}
                        </h2>

                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}

                    </div>

                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl",
                            theme.bg
                        )}
                    >
                        <Icon
                            className={cn(
                                "h-6 w-6",
                                theme.icon
                            )}
                        />
                    </div>

                </div>

                {trend && (
                    <div className="mt-5 flex items-center gap-2">

                        {trend.positive ? (
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        )}

                        <span
                            className={cn(
                                "text-sm font-medium",
                                trend.positive
                                    ? "text-emerald-600"
                                    : "text-red-600"
                            )}
                        >
                            {trend.value}
                        </span>

                    </div>
                )}

            </CardContent>
        </Card>
    );
}