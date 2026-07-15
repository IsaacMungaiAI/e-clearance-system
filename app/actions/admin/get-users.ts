"use server";

import { db } from "@/app/db";
import { profiles, departments } from "@/app/db/schema";
import { count, eq, or, ilike, and, desc } from "drizzle-orm";

export type UserEntry = {
  id: string;
  fullName: string | null;
  role: string | null;
  departmentId: string | null;
  departmentName: string | null;
  createdAt: Date | null;
};

export type UserFilters = {
  search?: string;
  role?: string;
  departmentId?: string;
  page?: number;
  pageSize?: number;
};

export type GetUsersResult = {
  users: UserEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  departments: { id: string; name: string }[];
};

export async function getUsers(
  filters: UserFilters = {}
): Promise<GetUsersResult> {
  try {
    const {
      search,
      role,
      departmentId,
      page = 1,
      pageSize = 25,
    } = filters;

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(profiles.fullName, `%${search}%`),
          ilike(profiles.id, `%${search}%`)
        )
      );
    }

    if (role) {
      conditions.push(eq(profiles.role, role as "student" | "officer_finance" | "officer_library" | "officer_hostel" | "registrar" | "admin"));
    }

    if (departmentId) {
      conditions.push(eq(profiles.departmentId, departmentId));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalResult, rows, deptList] = await Promise.all([
      db.select({ count: count() }).from(profiles).where(where),
      db
        .select({
          id: profiles.id,
          fullName: profiles.fullName,
          role: profiles.role,
          departmentId: profiles.departmentId,
          departmentName: departments.name,
          createdAt: profiles.createdAt,
        })
        .from(profiles)
        .leftJoin(departments, eq(profiles.departmentId, departments.id))
        .where(where)
        .orderBy(desc(profiles.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ id: departments.id, name: departments.name })
        .from(departments)
        .orderBy(departments.name),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      users: rows,
      total,
      page,
      pageSize,
      totalPages,
      departments: deptList,
    };
  } catch (err) {
    console.error("getUsers failed:", err);
    return {
      users: [],
      total: 0,
      page: 1,
      pageSize: 25,
      totalPages: 1,
      departments: [],
    };
  }
}
