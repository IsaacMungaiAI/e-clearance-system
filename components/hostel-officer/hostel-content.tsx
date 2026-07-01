'use client';

import dynamic from "next/dynamic";
import {
    ArrowUpRight,
    BellRing,
    Building2,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    DoorOpen,
    FileBarChart,
    ShieldAlert,
    TriangleAlert,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GlassLoading } from "@/components/ui/glass-loading";

const HostelStats = dynamic(
    () =>
        import("./hostel-stats").then((m) => ({ default: m.HostelStats })),
    { loading: () => <GlassLoading type="stats" /> }
);

const RoomCard = dynamic(
    () => import("./room-card").then((m) => ({ default: m.RoomCard })),
    { loading: () => <GlassLoading type="card" /> }
);

interface RoomData {
    id: string;
    roomNumber: string;
    hostelName: string;
    capacity: number;
    floor: number | null;
    status: string | null;
    occupantCount: number;
}

interface Stats {
    students: number;
    pending: number;
    approved: number;
    rejected: number;
    totalClearances: number;
    totalRooms: number;
    occupiedRooms: number;
}

interface HostelContentProps {
    stats: Stats;
    pendingRequests: number;
    roomsList: RoomData[];
    unreadNotifications: number;
}

export function HostelContent({
    stats,
    pendingRequests,
    roomsList,
    unreadNotifications,
}: HostelContentProps) {
    const roomsToShow = roomsList.slice(0, 6);

    return (
        <div className="space-y-8">
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-green-600 via-green-500 to-green-800 text-white shadow-lg">
                <CardContent className="grid gap-8 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
                    <div className="space-y-5">
                        <Badge className="w-fit border-white/15 bg-white/15 text-white hover:bg-white/20">
                            Live hostel operations
                        </Badge>

                        <div className="space-y-3">
                            <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
                                Keep room assignments, inspections, and
                                clearance requests under control from one
                                place.
                            </h2>
                            <p className="max-w-2xl text-sm text-white/90 md:text-base">
                                Review occupancy, flag maintenance issues, and
                                respond to student requests before they slow
                                down the clearance process.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button variant="secondary">
                                Review Requests
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                            >
                                Open Room Board
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-white/85">
                                    Today&apos;s inspections
                                </p>
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <p className="mt-2 text-3xl font-semibold">
                                {pendingRequests > 0 ? pendingRequests : 0}
                            </p>
                            <p className="mt-1 text-sm text-white/85">
                                {pendingRequests} clearance
                                request{pendingRequests !== 1 ? "s" : ""} pending
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-white/85">
                                    Notifications
                                </p>
                                <BellRing className="h-4 w-4" />
                            </div>
                            <p className="mt-2 text-3xl font-semibold">
                                {unreadNotifications}
                            </p>
                            <p className="mt-1 text-sm text-white/85">
                                {unreadNotifications} unread
                                notification{unreadNotifications !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <HostelStats
                pending={stats.pending}
                approved={stats.approved}
                rejected={stats.rejected}
                occupiedRooms={stats.occupiedRooms}
            />

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Operational priorities</CardTitle>
                        <CardDescription>
                            The main items the hostel office should focus on
                            today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                label: "Pending clearance reviews",
                                value: String(stats.pending),
                                tone: "amber" as const,
                            },
                            {
                                label: "Total rooms",
                                value: String(stats.totalRooms),
                                tone: "red" as const,
                            },
                            {
                                label: "Rooms currently in use",
                                value: String(stats.occupiedRooms),
                                tone: "emerald" as const,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border bg-muted/25 p-4"
                            >
                                <p className="text-sm text-muted-foreground">
                                    {item.label}
                                </p>
                                <div className="mt-2 flex items-end justify-between gap-3">
                                    <p className="text-3xl font-semibold tracking-tight">
                                        {item.value}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={
                                        item.tone === "amber"
                                            ? "border-amber-200 text-amber-700"
                                            : item.tone === "red"
                                              ? "border-red-200 text-red-700"
                                              : "border-primary/20 text-primary"
                                        }
                                    >
                                        {item.tone}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle>Quick actions</CardTitle>
                        <CardDescription>
                            Common hostel office tasks and shortcuts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <ClipboardList className="h-4 w-4" />
                            Review pending requests
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <DoorOpen className="h-4 w-4" />
                            Inspect vacant rooms
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <FileBarChart className="h-4 w-4" />
                            Generate occupancy report
                        </Button>
                    </CardContent>
                </Card>
            </section>

            {roomsToShow.length > 0 && (
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight">
                                Room overview
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Spot occupancy and inspection issues at a glance.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">Export</Button>
                            <Button>Open room map</Button>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {roomsToShow.map((room) => (
                            <RoomCard
                                key={room.id}
                                roomNumber={room.roomNumber}
                                hostelName={room.hostelName}
                                occupant={
                                    room.occupantCount > 0
                                        ? "Occupied"
                                        : "Vacant"
                                }
                                occupied={room.occupantCount > 0}
                                inspectionStatus="pending"
                                maintenanceRequired={
                                    room.status === "maintenance"
                                }
                                capacity={room.capacity}
                                occupants={room.occupantCount}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent hostel activity</CardTitle>
                        <CardDescription>
                            Most recent events affecting residents and room
                            management.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            {
                                title: `${stats.pending} clearance request${stats.pending !== 1 ? "s" : ""} pending review`,
                                description: `Hostel office has ${stats.pending} clearance step${stats.pending !== 1 ? "s" : ""} awaiting decision.`,
                                time: "Today",
                                icon: ClipboardList,
                                accent: "emerald" as const,
                            },
                            ...(stats.occupiedRooms > 0
                                ? [
                                      {
                                          title: `${stats.occupiedRooms} rooms currently occupied`,
                                          description: `${stats.totalRooms - stats.occupiedRooms} room${stats.totalRooms - stats.occupiedRooms !== 1 ? "s" : ""} available across all hostels.`,
                                          time: "Today",
                                          icon: CalendarClock,
                                          accent: "amber" as const,
                                      },
                                  ]
                                : []),
                            {
                                title: `${stats.approved} hostel clearances approved`,
                                description: `${stats.rejected} clearance${stats.rejected !== 1 ? "s" : ""} rejected this term.`,
                                time: "This term",
                                icon: ShieldAlert,
                                accent: "red" as const,
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            const accentClasses =
                        item.accent === "amber"
                            ? "bg-amber-100 text-amber-700"
                            : item.accent === "red"
                              ? "bg-red-100 text-red-700"
                              : "bg-primary/10 text-primary";

                            return (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-4 rounded-2xl border p-4"
                                >
                                    <div
                                        className={`rounded-xl p-2 ${accentClasses}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-medium">
                                                {item.title}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {item.time}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hostel summary</CardTitle>
                        <CardDescription>
                            A quick snapshot of the current hostel operation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium">Total rooms</p>
                                    <p className="text-sm text-muted-foreground">
                                        {stats.totalRooms} rooms across hostels
                                    </p>
                                </div>
                            </div>
                            <Badge variant="secondary">
                                {stats.totalRooms}
                            </Badge>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                                    <Users className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Residents checked in
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Current occupancy is stable
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-primary/20 text-primary"
                            >
                                {stats.totalRooms > 0
                                    ? `${Math.round(
                                          (stats.occupiedRooms /
                                              stats.totalRooms) *
                                              100
                                      )}%`
                                    : "0%"}
                            </Badge>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                                    <TriangleAlert className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Pending clearances
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Needs hostel office review
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-amber-200 text-amber-700"
                            >
                                {stats.pending} open
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
