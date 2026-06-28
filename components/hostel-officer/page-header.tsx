"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;

    description?: string;

    actions?: ReactNode;
}

export function PageHeader({
    title,
    description,
    actions,
}: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

                <h1 className="text-3xl font-bold tracking-tight">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 text-muted-foreground">
                        {description}
                    </p>
                )}

            </div>

            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}

        </div>
    );
}