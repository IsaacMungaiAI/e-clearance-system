"use client";

import {
    BedDouble,
    CircleAlert,
    DoorOpen,
    Hammer,
    User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export interface RoomCardProps {
    roomNumber: string;

    hostelName: string;

    occupant?: string;

    occupied: boolean;

    inspectionStatus:
    | "passed"
    | "pending"
    | "failed";

    maintenanceRequired?: boolean;

    capacity?: number;

    occupants?: number;

    onView?: () => void;
}

export function RoomCard({
    roomNumber,
    hostelName,
    occupant,
    occupied,
    inspectionStatus,
    maintenanceRequired = false,
    capacity = 1,
    occupants = 0,
    onView,
}: RoomCardProps) {
    const inspectionColor = {
        passed:
            "bg-primary/10 text-primary border-primary/20",

        pending:
            "bg-amber-100 text-amber-700 border-amber-200",

        failed:
            "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            <CardContent className="p-6">

                {/* Header */}

                <div className="flex items-start justify-between">

                    <div>

                        <p className="text-sm text-muted-foreground">

                            {hostelName}

                        </p>

                        <h2 className="mt-1 text-2xl font-bold">

                            Room {roomNumber}

                        </h2>

                    </div>

                    <div
                        className={cn(
                            "rounded-xl p-3",
                            occupied
                                ? "bg-primary/10"
                                : "bg-blue-50"
                        )}
                    >
                        <BedDouble
                            className={cn(
                                "h-6 w-6",
                                occupied
                                    ? "text-primary"
                                    : "text-blue-600"
                            )}
                        />
                    </div>

                </div>

                {/* Occupancy */}

                <div className="mt-6 space-y-4">

                    <div className="flex justify-between">

                        <span className="text-muted-foreground text-sm">

                            Status

                        </span>

                        <Badge
                            variant="outline"
                            className={
                                occupied
                                    ? "border-primary/20 text-primary"
                                    : "border-blue-200 text-blue-700"
                            }
                        >
                            {occupied
                                ? "Occupied"
                                : "Vacant"}
                        </Badge>

                    </div>

                    <div className="flex justify-between">

                        <span className="text-muted-foreground text-sm">

                            Capacity

                        </span>

                        <span className="font-medium">

                            {occupants}/{capacity}

                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span className="text-muted-foreground text-sm">

                            Resident

                        </span>

                        <div className="flex items-center gap-2">

                            <User className="h-4 w-4 text-muted-foreground" />

                            <span className="font-medium">

                                {occupant ?? "None"}

                            </span>

                        </div>

                    </div>

                    <div className="flex justify-between">

                        <span className="text-muted-foreground text-sm">

                            Inspection

                        </span>

                        <Badge
                            className={
                                inspectionColor[
                                inspectionStatus
                                ]
                            }
                        >
                            {inspectionStatus}
                        </Badge>

                    </div>

                    <div className="flex justify-between">

                        <span className="text-muted-foreground text-sm">

                            Maintenance

                        </span>

                        {maintenanceRequired ? (
                            <Badge
                                variant="destructive"
                                className="gap-1"
                            >
                                <Hammer className="h-3 w-3" />
                                Required
                            </Badge>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="gap-1"
                            >
                                <DoorOpen className="h-3 w-3" />
                                Good
                            </Badge>
                        )}

                    </div>

                </div>

                {/* Footer */}

                <div className="mt-6 flex gap-3">

                    <Button
                        className="flex-1"
                        onClick={onView}
                    >
                        View Details
                    </Button>

                    {maintenanceRequired && (
                        <Button
                            size="icon"
                            variant="outline"
                        >
                            <CircleAlert className="h-4 w-4 text-red-500" />
                        </Button>
                    )}

                </div>

            </CardContent>

        </Card>
    );
}