import { db } from "@/app/db";
import { notifications } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getNotifications(userId: string) {
    try {
        const rows = await db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(20);

        return rows;
    } catch (err) {
        console.error("getNotifications - DB query failed:", err);
        return [];
    }
}
