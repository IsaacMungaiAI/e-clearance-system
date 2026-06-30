import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function FinanceOfficerLayout({ children, }: {
    children: React.ReactNode;
}) {
    const session = await getUserProfile();
    const profile = session?.profile;

    if (profile?.role !== "officer_finance") {
        redirect("/unauthorized")
    }
    return <>{children}</>
}