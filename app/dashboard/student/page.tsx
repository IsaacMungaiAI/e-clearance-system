import { createClient } from "@/lib/supabase/server";
import { StudentDashboardShell } from "@/components/student/dashboard-shell";

export default async function StudentDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single();

  // Fetch clearance steps
  const { data: steps } = await supabase
    .from("clearance_steps")
    .select(`
      id,
      status,
      comment,
      departments (name)
    `)
    .eq("student_id", user?.id);

  return (
    <StudentDashboardShell
      initialData={{ steps: steps || [] }}
      userName={profile?.full_name || "Student"}
    />
  );
}