import { DashboardShell } from "@/components/finance-officer/dashboard-shell";
import { getDashboardStats } from "@/app/actions/finance-officer/get-dashboard-stats";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function FinanceOfficerPage() {
    const data = await getDashboardStats();
    const session = await getUserProfile();
    const profile = session?.profile;

    return (
        <DashboardShell
            initialData={data}
            userName={profile?.fullName ?? undefined}
        />
    );
}
