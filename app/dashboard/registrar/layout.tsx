
/*import { redirect } from "next/navigation";

import { getUserProfile } from "@/lib/getUserProfile";

const session=await getUserProfile();

const profile=session?.profile;

// app/dashboard/admin/layout.tsx
if (profile?.role !== "registrar") {
  redirect("/unauthorized");
}*/

// app/dashboard/registrar/layout.tsx
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function RegistrarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserProfile();
  const profile = session?.profile;

  if (profile?.role !== "registrar") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}