"use server";

import { db } from "@/app/db";
import { departments, profiles } from "@/app/db/schema";
import { count, eq, desc } from "drizzle-orm";

export type DepartmentEntry = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  userCount: number;
};

export async function getDepartments(): Promise<DepartmentEntry[]> {
  try {
    const rows = await db
      .select({
        id: departments.id,
        name: departments.name,
        code: departments.code,
        description: departments.description,
        isActive: departments.isActive,
        createdAt: departments.createdAt,
        userCount: count(profiles.id),
      })
      .from(departments)
      .leftJoin(profiles, eq(profiles.departmentId, departments.id))
      .groupBy(departments.id)
      .orderBy(desc(departments.createdAt));

    return rows;
  } catch (err) {
    console.error("getDepartments failed:", err);
    return [];
  }
}
