"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { profiles } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { logActivity, logAudit } from "@/lib/log";

const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  role: z
    .enum([
      "student",
      "officer_finance",
      "officer_library",
      "officer_hostel",
      "registrar",
      "admin",
    ])
    .optional(),
  departmentId: z.string().uuid().nullable().optional(),
});

export async function updateUserAction(formData: {
  userId: string;
  role?: string;
  departmentId?: string | null;
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
      await logActivity({
        userId: authUser.user.id,
        action: "update_user_denied",
        description: "Attempted to update user without admin role",
      });
      return { success: false, message: "Forbidden" };
    }

    const validated = UpdateUserSchema.parse(formData);

    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, validated.userId))
      .limit(1);

    if (!existing) {
      return { success: false, message: "User not found" };
    }

    const updates: Record<string, unknown> = {};
    if (validated.role !== undefined) updates.role = validated.role;
    if (validated.departmentId !== undefined)
      updates.departmentId = validated.departmentId;

    if (Object.keys(updates).length === 0) {
      return { success: false, message: "No changes to apply" };
    }

    await db
      .update(profiles)
      .set(updates)
      .where(eq(profiles.id, validated.userId));

    await logActivity({
      userId: authUser.user.id,
      action: "update_user",
      description: `Updated user ${existing.fullName} (${validated.userId})`,
    });

    await logAudit({
      actorId: authUser.user.id,
      action: "update_user",
      entity: "profiles",
      entityId: validated.userId,
      oldData: {
        role: existing.role,
        departmentId: existing.departmentId,
      },
      newData: updates,
    });

    revalidatePath("/dashboard/admin");

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("updateUserAction failed:", error);
    return { success: false, message: "Failed to update user" };
  }
}
