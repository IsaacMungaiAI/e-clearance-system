import { Suspense } from "react";
import dynamic from "next/dynamic";

import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";

import { getUserProfile } from "@/lib/getUserProfile";
import { getDashboardStats } from "@/app/actions/hostel-officer/get-dashboard-stats";
import { getClearanceRequests } from "@/app/actions/hostel-officer/get-clearance-requests";
import { getRooms } from "@/app/actions/hostel-officer/get-rooms";
import { getNotifications } from "@/app/actions/hostel-officer/get-notifications";

const HostelContent = dynamic(
    () =>
        import("@/components/hostel-officer/hostel-content").then(
            (m) => ({ default: m.HostelContent })
        ),
    { loading: () => <GlassLoading type="stats" /> }
);

export default async function HostelOfficerPage() {
    const session = await getUserProfile();

    const userName =
        session?.profile?.fullName?.trim() ||
        session?.user?.email?.split("@")[0] ||
        "Hostel Officer";

    const userEmail = session?.user?.email;
    const userId = session?.user?.id;

    const { stats } = await getDashboardStats();
    const clearanceRequests = await getClearanceRequests();
    const roomsList = await getRooms();
    const notificationsData = userId ? await getNotifications(userId) : [];

    const pendingRequests = clearanceRequests.filter(
        (r) => r.status === "pending"
    );
    const activeNotifications = notificationsData.filter((n) => !n.read);

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Hostel Officer Dashboard"
            description="Monitor occupancy, room status, and resident clearance activity."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="stats" />}>
                <HostelContent
                    stats={stats}
                    pendingRequests={pendingRequests.length}
                    roomsList={roomsList}
                    unreadNotifications={activeNotifications.length}
                />
            </Suspense>
        </DashboardShell>
    );
}
