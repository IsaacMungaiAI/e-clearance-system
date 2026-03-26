// app/dashboard/officer/layout.tsx

import { redirect } from "next/dist/client/components/navigation";


import { getUserProfile } from "@/lib/getUserProfile";
const session = await getUserProfile();

const profile = session?.profile;
if (profile?.role !== "officer") {
  redirect("/unauthorized");
}