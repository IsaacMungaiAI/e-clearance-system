
import { redirect } from "next/navigation";

import { getUserProfile } from "@/lib/getUserProfile";

const session=await getUserProfile();

const profile=session?.profile;

// app/dashboard/admin/layout.tsx
if (profile?.role !== "admin") {
  redirect("/unauthorized");
}