"use server";

import { db } from "@/app/db";
import { profiles, activityLogs, departments, clearanceRequests } from "@/app/db/schema";
import { desc, gte, eq, or, sql, count } from "drizzle-orm";

export type OverviewStats = {
  totalUsers: number;
  totalStudents: number;
  totalOfficers: number;
  totalAdmins: number;
  totalDepartments: number;
  pendingClearances: number;
  approvedClearances: number;
  rejectedClearances: number;
  recentActivityCount: number;
  recentRegistrations: {
    id: string;
    fullName: string | null;
    role: string | null;
    createdAt: Date | null;
  }[];
};

export async function getOverviewStats(): Promise<OverviewStats> {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      totalResult,
      studentsResult,
      officersResult,
      adminsResult,
      deptCountResult,
      pendingResult,
      approvedResult,
      rejectedResult,
      recentActivityCount,
      recentRegistrations,
    ] = await Promise.all([
      db.select({ count: count() }).from(profiles),

      db.select({ count: count() }).from(profiles).where(eq(profiles.role, "student")),

      db.select({ count: count() }).from(profiles).where(
        or(
          eq(profiles.role, "officer_library"),
          eq(profiles.role, "officer_finance"),
          eq(profiles.role, "officer_hostel"),
        )
      ),

      db.select({ count: count() }).from(profiles).where(eq(profiles.role, "admin")),

      db.select({ count: count() }).from(departments),

      db.select({ count: count() }).from(clearanceRequests).where(eq(clearanceRequests.status, "pending")),

      db.select({ count: count() }).from(clearanceRequests).where(eq(clearanceRequests.status, "approved")),

      db.select({ count: count() }).from(clearanceRequests).where(eq(clearanceRequests.status, "rejected")),

      db
        .select({ count: sql<number>`count(*)::int` })
        .from(activityLogs)
        .where(gte(activityLogs.createdAt, oneWeekAgo)),

      db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          role: profiles.role,
          createdAt: profiles.createdAt,
        })
        .from(profiles)
        .orderBy(desc(profiles.createdAt))
        .limit(5),
    ]);

    return {
      totalUsers: totalResult[0]?.count ?? 0,
      totalStudents: studentsResult[0]?.count ?? 0,
      totalOfficers: officersResult[0]?.count ?? 0,
      totalAdmins: adminsResult[0]?.count ?? 0,
      totalDepartments: deptCountResult[0]?.count ?? 0,
      pendingClearances: pendingResult[0]?.count ?? 0,
      approvedClearances: approvedResult[0]?.count ?? 0,
      rejectedClearances: rejectedResult[0]?.count ?? 0,
      recentActivityCount: recentActivityCount[0]?.count ?? 0,
      recentRegistrations,
    };
  } catch (err) {
    console.error("getOverviewStats failed:", err);
    return {
      totalUsers: 0,
      totalStudents: 0,
      totalOfficers: 0,
      totalAdmins: 0,
      totalDepartments: 0,
      pendingClearances: 0,
      approvedClearances: 0,
      rejectedClearances: 0,
      recentActivityCount: 0,
      recentRegistrations: [],
    };
  }
}
