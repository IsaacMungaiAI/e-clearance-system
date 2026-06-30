import { db } from "@/app/db";
import {
    clearanceSteps,
    clearanceRequests,
    profiles,
    departments,
} from "@/app/db/schema";
import { and, eq, ilike, desc } from "drizzle-orm";

export async function getFeeClearances(q = "") {
    try {
        const financeDept = await db
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.name, "Finance"))
            .limit(1);

        const financeDepartmentId = financeDept[0]?.id;
        if (!financeDepartmentId) return [];

        const whereClause = and(
            eq(clearanceSteps.departmentId, financeDepartmentId),
            q ? ilike(profiles.fullName, `%${q}%`) : undefined
        );

        const rows = await db
            .select({
                id: clearanceSteps.id,
                clearanceRequestId: clearanceSteps.clearanceRequestId,
                status: clearanceSteps.status,
                comment: clearanceSteps.comment,
                updatedAt: clearanceSteps.updatedAt,
                studentId: clearanceRequests.studentId,
                studentName: profiles.fullName,
            })
            .from(clearanceSteps)
            .innerJoin(
                clearanceRequests,
                eq(clearanceSteps.clearanceRequestId, clearanceRequests.id)
            )
            .innerJoin(
                profiles,
                eq(clearanceRequests.studentId, profiles.id)
            )
            .where(whereClause)
            .orderBy(desc(clearanceSteps.updatedAt));

        return rows;
    } catch (err) {
        console.error("getFeeClearances - DB query failed:", err);
        return [];
    }
}
