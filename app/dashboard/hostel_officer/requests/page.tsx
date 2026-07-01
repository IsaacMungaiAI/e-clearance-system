import { Suspense } from "react";
import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { GlassLoading } from "@/components/ui/glass-loading";
import { getUserProfile } from "@/lib/getUserProfile";
import { getClearanceRequests } from "@/app/actions/hostel-officer/get-clearance-requests";
import { ClearanceRequestsList } from "./clearance-requests-list";

export default async function RequestsPage() {
    const session = await getUserProfile();
    const userName = session?.profile?.fullName?.trim() || "Hostel Officer";
    const userEmail = session?.user?.email;

    const requests = await getClearanceRequests();

    return (
        <DashboardShell
            sidebar={<HostelSidebar />}
            title="Clearance Requests"
            description="Review and manage hostel clearance requests from students."
            userName={userName}
            userEmail={userEmail}
        >
            <Suspense fallback={<GlassLoading type="table" />}>
                <ClearanceRequestsList requests={requests} />
            </Suspense>
        </DashboardShell>
    );
}
