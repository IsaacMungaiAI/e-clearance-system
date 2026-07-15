"use server";

import { db } from "@/app/db";
import { profiles, departments, clearanceRequests, clearanceSteps } from "@/app/db/schema";
import { count, eq, sql } from "drizzle-orm";

export type DepartmentReport = {
  departmentId: string;
  departmentName: string;
  totalSteps: number;
  approvedSteps: number;
  rejectedSteps: number;
  pendingSteps: number;
  completionRate: number;
};

export type ReportsData = {
  totalClearances: number;
  approvedClearances: number;
  rejectedClearances: number;
  pendingClearances: number;
  overallCompletionRate: number;
  departmentReports: DepartmentReport[];
  roleDistribution: {
    role: string;
    count: number;
  }[];
};

export async function getReports(): Promise<ReportsData> {
  try {
    const [totalResult, approvedResult, rejectedResult, pendingResult, roleDistributionRaw] =
      await Promise.all([
        db.select({ count: count() }).from(clearanceRequests),
        db.select({ count: count() }).from(clearanceRequests).where(eq(clearanceRequests.status, "approved")),
        db.select({ count: count() }).from(clearanceRequests).where(eq(clearanceRequests.status, "rejected")),
        db.select({ count: count() }).from(clearanceRequests).where(eq(clearanceRequests.status, "pending")),
        db
          .select({
            role: sql<string>`COALESCE(${profiles.role}, 'unknown')`,
            count: count(),
          })
          .from(profiles)
          .groupBy(profiles.role),
      ]);

    const tc = totalResult[0]?.count ?? 0;
    const ac = approvedResult[0]?.count ?? 0;

    const deptRows = await db
      .select({
        departmentId: departments.id,
        departmentName: departments.name,
        totalSteps: count(clearanceSteps.id),
        approvedSteps: sql<number>`count(${clearanceSteps.id}) filter (where ${clearanceSteps.status} = 'approved')`,
        rejectedSteps: sql<number>`count(${clearanceSteps.id}) filter (where ${clearanceSteps.status} = 'rejected')`,
        pendingSteps: sql<number>`count(${clearanceSteps.id}) filter (where ${clearanceSteps.status} = 'pending')`,
      })
      .from(departments)
      .leftJoin(clearanceSteps, sql`${clearanceSteps.departmentId} = ${departments.id}`)
      .groupBy(departments.id, departments.name)
      .orderBy(departments.name);

    const departmentReports: DepartmentReport[] = deptRows.map(
      (row) => ({
        departmentId: row.departmentId,
        departmentName: row.departmentName,
        totalSteps: row.totalSteps ?? 0,
        approvedSteps: row.approvedSteps ?? 0,
        rejectedSteps: row.rejectedSteps ?? 0,
        pendingSteps: row.pendingSteps ?? 0,
        completionRate:
          (row.totalSteps ?? 0) > 0
            ? Math.round(((row.approvedSteps ?? 0) / row.totalSteps) * 100)
            : 0,
      })
    );

    const roleDistribution = roleDistributionRaw.map((r) => ({
      role: r.role ?? "unknown",
      count: r.count ?? 0,
    }));

    return {
      totalClearances: tc,
      approvedClearances: ac,
      rejectedClearances: rejectedResult[0]?.count ?? 0,
      pendingClearances: pendingResult[0]?.count ?? 0,
      overallCompletionRate: tc > 0 ? Math.round((ac / tc) * 100) : 0,
      departmentReports,
      roleDistribution,
    };
  } catch (err) {
    console.error("getReports failed:", err);
    return {
      totalClearances: 0,
      approvedClearances: 0,
      rejectedClearances: 0,
      pendingClearances: 0,
      overallCompletionRate: 0,
      departmentReports: [],
      roleDistribution: [],
    };
  }
}
