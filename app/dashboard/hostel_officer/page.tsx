import { Suspense } from "react";
import dynamic from "next/dynamic";

import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";

import { getUserProfile } from "@/lib/getUserProfile";

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

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Hostel Officer Dashboard"
            description="Monitor occupancy, room status, and resident clearance activity."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="stats" />}>
                <HostelContent />
            </Suspense>
        </DashboardShell>
    );
}
