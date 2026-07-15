"use server";

import { db } from "@/app/db";
import { activityLogs, auditLogs, profiles } from "@/app/db/schema";
import { desc, eq, and, gte, lte, sql } from "drizzle-orm";

export type LogEntry = {
  id: string;
  type: "activity" | "audit";
  actorId: string;
  actorName: string | null;
  action: string;
  description: string | null;
  entity: string | null;
  entityId: string | null;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: string;
};

export type LogFilters = {
  dateFrom?: string;
  dateTo?: string;
  action?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type GetLogsResult = {
  logs: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  actions: string[];
};

export async function getLogs(
  filters: LogFilters = {}
): Promise<GetLogsResult> {
  try {
    const {
      dateFrom,
      dateTo,
      action: actionFilter,
      search,
      page = 1,
      pageSize = 50,
    } = filters;

    const activityConditions = [];
    const auditConditions = [];

    if (dateFrom) {
      activityConditions.push(gte(activityLogs.createdAt, new Date(dateFrom)));
      auditConditions.push(gte(auditLogs.createdAt, new Date(dateFrom)));
    }
    if (dateTo) {
      activityConditions.push(lte(activityLogs.createdAt, new Date(dateTo)));
      auditConditions.push(lte(auditLogs.createdAt, new Date(dateTo)));
    }
    if (actionFilter) {
      activityConditions.push(eq(activityLogs.action, actionFilter));
      auditConditions.push(eq(auditLogs.action, actionFilter));
    }

    const activityQuery = db
      .select({
        id: activityLogs.id,
        type: sql<string>`'activity'`,
        actorId: activityLogs.userId,
        actorName: profiles.fullName,
        action: activityLogs.action,
        description: activityLogs.description,
        entity: sql<string | null>`NULL`,
        entityId: sql<string | null>`NULL`,
        oldData: sql<Record<string, unknown> | null>`NULL`,
        newData: sql<Record<string, unknown> | null>`NULL`,
        createdAt: activityLogs.createdAt,
      })
      .from(activityLogs)
      .leftJoin(profiles, eq(activityLogs.userId, profiles.id))
      .orderBy(desc(activityLogs.createdAt));

    const auditQuery = db
      .select({
        id: auditLogs.id,
        type: sql<string>`'audit'`,
        actorId: auditLogs.actorId,
        actorName: profiles.fullName,
        action: auditLogs.action,
        description: sql<string | null>`NULL`,
        entity: auditLogs.entity,
        entityId: auditLogs.entityId,
        oldData: auditLogs.oldData,
        newData: auditLogs.newData,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .leftJoin(profiles, eq(auditLogs.actorId, profiles.id))
      .orderBy(desc(auditLogs.createdAt));

    const finalActivityQuery =
      activityConditions.length > 0
        ? activityQuery.where(and(...activityConditions))
        : activityQuery;
    const finalAuditQuery =
      auditConditions.length > 0
        ? auditQuery.where(and(...auditConditions))
        : auditQuery;

    const [activityRows, auditRows] = await Promise.all([
      finalActivityQuery,
      finalAuditQuery,
    ]);

    const rawCombined = [...activityRows, ...auditRows].sort(
      (a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      }
    );

    let combined: LogEntry[] = rawCombined.map((row) => ({
      id: row.id,
      type: row.type as "activity" | "audit",
      actorId: row.actorId,
      actorName: row.actorName,
      action: row.action,
      description: row.description,
      entity: row.entity,
      entityId: row.entityId,
      oldData: row.oldData as Record<string, unknown> | null,
      newData: row.newData as Record<string, unknown> | null,
      createdAt:
        typeof row.createdAt === "string"
          ? row.createdAt
          : row.createdAt
          ? new Date(row.createdAt).toISOString()
          : new Date().toISOString(),
    }));

    if (search) {
      const q = search.toLowerCase();
      combined = combined.filter(
        (row) =>
          (row.actorName ?? "").toLowerCase().includes(q) ||
          row.action.toLowerCase().includes(q) ||
          (row.description ?? "").toLowerCase().includes(q) ||
          (row.entity ?? "").toLowerCase().includes(q)
      );
    }

    const total = combined.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const logs = combined.slice(start, start + pageSize);

    const actionSet = new Set<string>();
    activityRows.forEach((r) => actionSet.add(r.action));
    auditRows.forEach((r) => actionSet.add(r.action));
    const actions = Array.from(actionSet).sort();

    return { logs, total, page, pageSize, totalPages, actions };
  } catch (err) {
    console.error("getLogs failed:", err);
    return {
      logs: [],
      total: 0,
      page: 1,
      pageSize: 50,
      totalPages: 1,
      actions: [],
    };
  }
}
