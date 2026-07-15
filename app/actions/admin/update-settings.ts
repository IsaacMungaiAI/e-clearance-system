"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { systemSettings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { logActivity, logAudit } from "@/lib/log";

export async function updateSettingsAction(formData: {
  academicPeriod?: string;
  clearanceDeadline?: string;
  notificationsEnabled?: string;
  maxClearanceRetries?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: authUser } = await supabase.auth.getUser();

    if (!authUser?.user) {
      return { success: false, message: "Unauthorized" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authUser.user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, message: "Forbidden" };
    }

    const entries = Object.entries(formData).filter(
      ([, v]) => v !== undefined
    );

    if (entries.length === 0) {
      return { success: false, message: "No settings to update" };
    }

    for (const [key, value] of entries) {
      const [existing] = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, key))
        .limit(1);

      const oldData = existing ? { value: existing.value } : undefined;

      if (existing) {
        await db
          .update(systemSettings)
          .set({ value: value ?? "", updatedAt: new Date() })
          .where(eq(systemSettings.key, key));
      } else {
        await db.insert(systemSettings).values({ key, value: value ?? "" });
      }

      await logAudit({
        actorId: authUser.user.id,
        action: "update_setting",
        entity: "system_settings",
        entityId: key,
        oldData,
        newData: { value },
      });
    }

    await logActivity({
      userId: authUser.user.id,
      action: "update_settings",
      description: `Updated ${entries.length} system setting(s)`,
    });

    revalidatePath("/dashboard/admin");

    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    console.error("updateSettingsAction failed:", error);
    return { success: false, message: "Failed to update settings" };
  }
}
