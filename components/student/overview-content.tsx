'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function OverviewContent({ steps }: { steps: any[] }) {
    const total = steps.length || 0;
    const approved = steps.filter((s) => s.status === "approved").length || 0;
    const pending = steps.filter((s) => s.status === "pending").length || 0;
    const rejected = steps.filter((s) => s.status === "rejected").length || 0;
    const progress = total ? (approved / total) * 100 : 0;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Steps
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                        <p className="text-xs text-muted-foreground">
                            Departments to clear
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Approved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">
                            {approved}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Departments cleared
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {pending}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Departments pending
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Clearance Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">
                        {approved} of {total} departments cleared (
                        {Math.round(progress)}%)
                    </p>
                    {progress === 100 && (
                        <div className="text-center p-4 bg-accent rounded-lg text-primary">
                            <p className="font-semibold">
                                Clearance Complete!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Department Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {steps.map((step: any) => (
                        <div
                            key={step.id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-medium">
                                    {step.departments?.[0]?.name ||
                                        "Unknown Department"}
                                </p>
                                {step.comment && (
                                    <p className="text-sm text-muted-foreground">
                                        {step.comment}
                                    </p>
                                )}
                            </div>
                            <StatusBadge status={step.status} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <Badge
            variant={
                status === "approved"
                    ? "default"
                    : status === "pending"
                      ? "secondary"
                      : "destructive"
            }
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
}
