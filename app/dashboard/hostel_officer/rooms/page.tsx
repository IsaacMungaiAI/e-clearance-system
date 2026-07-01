import { Suspense } from "react";
import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";
import { getUserProfile } from "@/lib/getUserProfile";
import { getRooms } from "@/app/actions/hostel-officer/get-rooms";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble } from "lucide-react";

const statusStyles: Record<string, string> = {
    full: "border-primary/20 text-primary",
    occupied: "border-blue-200 text-blue-700",
    available: "border-emerald-200 text-emerald-700",
    vacant: "border-muted-foreground/30 text-muted-foreground",
};

function roomStatus(
    occupantCount: number,
    capacity: number,
    dbStatus: string | null
): { label: string; style: string } {
    const s = dbStatus ?? "available";
    if (occupantCount >= capacity) return { label: "full", style: statusStyles.full };
    if (occupantCount > 0) return { label: "occupied", style: statusStyles.occupied };
    if (s === "maintenance") return { label: "maintenance", style: statusStyles.vacant };
    return { label: "vacant", style: statusStyles.vacant };
}

export default async function RoomsPage() {
    const session = await getUserProfile();
    const userName = session?.profile?.fullName?.trim() || "Hostel Officer";
    const userEmail = session?.user?.email;

    const rooms = await getRooms();

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Rooms"
            description="Overview of hostel room occupancy and status."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="stats" />}>
                {rooms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No rooms found.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {rooms.map((room) => {
                            const { label, style } = roomStatus(
                                room.occupantCount,
                                room.capacity,
                                room.status
                            );
                            return (
                                <Card key={room.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <BedDouble className="h-5 w-5 text-primary" />
                                            <Badge
                                                variant="outline"
                                                className={style}
                                            >
                                                {label}
                                            </Badge>
                                        </div>
                                        <CardTitle className="mt-2">
                                            Room {room.roomNumber}
                                        </CardTitle>
                                        <CardDescription>
                                            {room.hostelName}
                                            {room.floor
                                                ? ` - Floor ${room.floor}`
                                                : ""}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {room.occupantCount} /{" "}
                                            {room.capacity} occupants
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </Suspense>
        </DashboardShell>
    );
}
