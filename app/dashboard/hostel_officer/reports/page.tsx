import { Suspense } from "react";
import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";
import { getUserProfile } from "@/lib/getUserProfile";
import { ReportsGrid } from "./reports-grid";

export default async function ReportsPage() {
    const session = await getUserProfile();
    const userName = session?.profile?.fullName?.trim() || "Hostel Officer";
    const userEmail = session?.user?.email;

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Reports"
            description="Generate and download hostel management reports."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="card" count={2} />}>
                <ReportsGrid />
            </Suspense>
        </DashboardShell>
    );
}
