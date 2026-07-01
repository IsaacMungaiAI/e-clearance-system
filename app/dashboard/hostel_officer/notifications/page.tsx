import { Suspense } from "react";
import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";
import { getUserProfile } from "@/lib/getUserProfile";
import { getNotifications } from "@/app/actions/hostel-officer/get-notifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

function timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default async function NotificationsPage() {
    const session = await getUserProfile();
    const userName = session?.profile?.fullName?.trim() || "Hostel Officer";
    const userEmail = session?.user?.email;
    const userId = session?.user?.id;

    const notificationsData = userId ? await getNotifications(userId) : [];

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Notifications"
            description="Recent alerts and updates for the hostel office."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="list" />}>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle>All Notifications</CardTitle>
                            <Badge variant="default" className="ml-2">
                                {notificationsData.length}
                            </Badge>
                        </div>
                        <CardDescription>
                            Stay updated with hostel activities and alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {notificationsData.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No notifications yet.
                            </p>
                        ) : (
                            notificationsData.map((n) => (
                                <div
                                    key={n.id}
                                    className="flex items-start gap-4 rounded-lg border p-4"
                                >
                                    <div
                                        className={`rounded-xl p-2 ${
                                            n.read
                                                ? "bg-primary/10 text-primary"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        <Bell className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-medium">
                                                {n.title}
                                                {!n.read && (
                                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />
                                                )}
                                            </p>
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {n.createdAt
                                                    ? timeAgo(n.createdAt)
                                                    : ""}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </Suspense>
        </DashboardShell>
    );
}
