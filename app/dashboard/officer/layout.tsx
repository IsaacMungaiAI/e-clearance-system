// app/dashboard/officer/layout.tsx

import { redirect } from "next/dist/client/components/navigation";


import { getUserProfile } from "@/lib/getUserProfile";
import { NextResponse } from 'next/server';
const session = await getUserProfile();

const profile = session?.profile;
if (profile?.role !== "officer") {
  redirect("/unauthorized");
}