import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserProfile();
  const profile = session?.profile;

  if (profile?.role !== "admin") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
