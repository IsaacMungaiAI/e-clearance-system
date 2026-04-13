import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardRouter() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  switch (profile.role) {
    case "student":
      redirect("/dashboard/student");
    case "officer_hostel":
      redirect("/dashboard/hostel_officer");
    case "registrar":
      redirect("/dashboard/registrar");
      case "officer_finance":
        redirect("/dashboard/finance_officer");
    default:
      redirect("/login");
  }
}
