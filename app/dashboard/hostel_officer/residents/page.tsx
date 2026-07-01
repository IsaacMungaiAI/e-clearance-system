import { Suspense } from "react";
import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";
import { getUserProfile } from "@/lib/getUserProfile";
import { getResidents } from "@/app/actions/hostel-officer/get-residents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ResidentsPage() {
    const session = await getUserProfile();
    const userName = session?.profile?.fullName?.trim() || "Hostel Officer";
    const userEmail = session?.user?.email;

    const { rows: residents, total } = await getResidents({ pageSize: 50 });

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Residents"
            description="View and manage hostel residents."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="table" />}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            <CardTitle>All Residents</CardTitle>
                            <Badge variant="outline" className="ml-2">
                                {total}
                            </Badge>
                        </div>
                        <CardDescription>
                            Currently checked-in hostel residents.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {residents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No residents found.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {residents.map((r) => (
                                    <div
                                        key={r.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {r.studentName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Room {r.roomNumber} &middot;{" "}
                                                {r.hostelName}
                                            </p>
                                        </div>
                                        <Badge variant="default">Active</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Suspense>
        </DashboardShell>
    );
}
