'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ClearancesContent({ steps }: { steps: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Clearance Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {steps.map((step: any) => (
                        <div key={step.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium">
                                        {step.departments?.[0]?.name ||
                                            "Unknown Department"}
                                    </h3>
                                    <StatusBadge status={step.status} />
                                </div>
                            </div>
                            {step.comment && (
                                <div className="mt-2 p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium">
                                            Comment:
                                        </span>{" "}
                                        {step.comment}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
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
