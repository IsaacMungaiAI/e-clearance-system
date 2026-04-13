// app/dashboard/officer/layout.tsx

// app/dashboard/officer/layout.tsx
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserProfile();
  const profile = session?.profile;

  if (profile?.role !== "officer_hostel") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}