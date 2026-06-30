"use server";

import { db } from "@/app/db";
import { clearanceSteps } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateClearanceStep(
    stepId: string,
    status: "approved" | "rejected",
    comment?: string
) {
    try {
        await db
            .update(clearanceSteps)
            .set({
                status,
                comment: comment || null,
                updatedAt: new Date(),
            })
            .where(eq(clearanceSteps.id, stepId));

        revalidatePath("/dashboard/finance_officer");
        return { success: true };
    } catch (err) {
        console.error("updateClearanceStep failed:", err);
        throw new Error("Failed to update clearance step");
    }
}
