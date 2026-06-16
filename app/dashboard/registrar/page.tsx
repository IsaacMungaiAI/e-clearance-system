
import { DashboardShell } from "@/components/registrar/dashboard-shell";
import { getDashboardStats } from "@/app/actions/registrar/get-dashboard-stats";

export default async function RegistrarPage() {
  const data = await getDashboardStats();

  return <DashboardShell initialData={data} />;
}