import { db } from "@/app/db";
import { activityLogs, auditLogs } from "@/app/db/schema";

export async function logActivity(params: {
  userId: string;
  action: string;
  description?: string;
}) {
  try {
    await db.insert(activityLogs).values({
      userId: params.userId,
      action: params.action,
      description: params.description ?? null,
    });
  } catch (err) {
    console.error("Failed to write activity log:", err);
  }
}

export async function logAudit(params: {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
}) {
  try {
    await db.insert(auditLogs).values({
      actorId: params.actorId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      oldData: params.oldData ?? null,
      newData: params.newData ?? null,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
