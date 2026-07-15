"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/app/db";
import { departments } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { logActivity, logAudit } from "@/lib/log";

const CreateDepartmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(1, "Code is required").max(20),
  description: z.string().optional(),
});

export async function createDepartmentAction(formData: {
  name: string;
  code: string;
  description?: string;
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

    const validated = CreateDepartmentSchema.parse(formData);

    const existing = await db
      .select()
      .from(departments)
      .where(eq(departments.name, validated.name))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, message: "Department name already exists" };
    }

    const existingCode = await db
      .select()
      .from(departments)
      .where(eq(departments.code, validated.code))
      .limit(1);

    if (existingCode.length > 0) {
      return { success: false, message: "Department code already exists" };
    }

    const [newDept] = await db
      .insert(departments)
      .values({
        name: validated.name,
        code: validated.code,
        description: validated.description || null,
      })
      .returning();

    await logActivity({
      userId: authUser.user.id,
      action: "create_department",
      description: `Created department "${validated.name}" (${validated.code})`,
    });

    await logAudit({
      actorId: authUser.user.id,
      action: "create_department",
      entity: "departments",
      entityId: newDept.id,
      newData: {
        name: validated.name,
        code: validated.code,
        description: validated.description,
      },
    });

    revalidatePath("/dashboard/admin");

    return { success: true, message: "Department created successfully" };
  } catch (error) {
    console.error("createDepartmentAction failed:", error);
    return { success: false, message: "Failed to create department" };
  }
}
