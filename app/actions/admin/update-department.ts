"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { departments } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { logActivity, logAudit } from "@/lib/log";

const UpdateDepartmentSchema = z.object({
  departmentId: z.string().uuid(),
  name: z.string().min(2).optional(),
  code: z.string().min(1).max(20).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function updateDepartmentAction(formData: {
  departmentId: string;
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
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

    const validated = UpdateDepartmentSchema.parse(formData);

    const [existing] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, validated.departmentId))
      .limit(1);

    if (!existing) {
      return { success: false, message: "Department not found" };
    }

    const updates: Record<string, unknown> = {};
    if (validated.name !== undefined) updates.name = validated.name;
    if (validated.code !== undefined) updates.code = validated.code;
    if (validated.description !== undefined)
      updates.description = validated.description;
    if (validated.isActive !== undefined) updates.isActive = validated.isActive;

    if (Object.keys(updates).length === 0) {
      return { success: false, message: "No changes to apply" };
    }

    await db
      .update(departments)
      .set(updates)
      .where(eq(departments.id, validated.departmentId));

    await logActivity({
      userId: authUser.user.id,
      action: "update_department",
      description: `Updated department "${existing.name}" (${validated.departmentId})`,
    });

    await logAudit({
      actorId: authUser.user.id,
      action: "update_department",
      entity: "departments",
      entityId: validated.departmentId,
      oldData: {
        name: existing.name,
        code: existing.code,
        description: existing.description,
        isActive: existing.isActive,
      },
      newData: updates,
    });

    revalidatePath("/dashboard/admin");

    return { success: true, message: "Department updated successfully" };
  } catch (error) {
    console.error("updateDepartmentAction failed:", error);
    return { success: false, message: "Failed to update department" };
  }
}
