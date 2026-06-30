import { db } from "@/app/db";
import {
    profiles,
    clearanceSteps,
    clearanceRequests,
    departments,
} from "@/app/db/schema";
import {
    and,
    eq,
    ilike,
    count,
    desc,
    asc,
} from "drizzle-orm";

type ListParams = {
    q?: string;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortDir?: "asc" | "desc";
};

export async function getStudentsFeeStatus({
    q = "",
    page = 1,
    pageSize = 10,
    sortField = "fullName",
    sortDir = "asc",
}: ListParams = {}) {
    try {
        const financeDept = await db
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.name, "Finance"))
            .limit(1);

        const financeDepartmentId = financeDept[0]?.id;
        if (!financeDepartmentId) {
            return { rows: [], total: 0, page, pageSize };
        }

        const studentWhere = and(
            eq(profiles.role, "student"),
            q ? ilike(profiles.fullName, `%${q}%`) : undefined
        );

        const offset = Math.max(0, (page - 1) * pageSize);

        const rows = await db
            .select({
                id: profiles.id,
                fullName: profiles.fullName,
                feeStatus: clearanceSteps.status,
                updatedAt: clearanceSteps.updatedAt,
            })
            .from(profiles)
            .leftJoin(
                clearanceRequests,
                eq(clearanceRequests.studentId, profiles.id)
            )
            .leftJoin(
                clearanceSteps,
                and(
                    eq(clearanceSteps.clearanceRequestId, clearanceRequests.id),
                    eq(clearanceSteps.departmentId, financeDepartmentId)
                )
            )
            .where(studentWhere)
            .orderBy(
                sortDir === "asc"
                    ? asc(profiles.fullName)
                    : desc(profiles.fullName)
            )
            .limit(pageSize)
            .offset(offset);

        const totalRes = await db
            .select({ count: count() })
            .from(profiles)
            .where(studentWhere);

        return {
            rows,
            total: Number(totalRes[0]?.count ?? 0),
            page,
            pageSize,
        };
    } catch (err) {
        console.error("getStudentsFeeStatus - DB query failed:", err);
        return { rows: [], total: 0, page, pageSize };
    }
}
