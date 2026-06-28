"use client";

import {
    BedDouble,
    CheckCircle2,
    Clock,
    XCircle,
} from "lucide-react";

import { StatsCard } from "@/components/hostel-officer/stats-card";

interface HostelStatsProps {
    pending: number;
    approved: number;
    rejected: number;
    occupiedRooms: number;
}

export function HostelStats({
    pending,
    approved,
    rejected,
    occupiedRooms,
}: HostelStatsProps) {
    return (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <StatsCard
                title="Pending Requests"
                value={pending}
                icon={Clock}
                color="amber"
                description="Awaiting review"
            />

            <StatsCard
                title="Approved"
                value={approved}
                icon={CheckCircle2}
                color="emerald"
                description="Successfully cleared"
            />

            <StatsCard
                title="Rejected"
                value={rejected}
                icon={XCircle}
                color="red"
                description="Require student action"
            />

            <StatsCard
                title="Occupied Rooms"
                value={occupiedRooms}
                icon={BedDouble}
                color="blue"
                description="Current hostel occupancy"
            />

        </section>
    );
}