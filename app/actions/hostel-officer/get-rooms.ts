import { db } from "@/app/db";
import { rooms, roomAssignments } from "@/app/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function getRooms() {
    try {
        const rows = await db
            .select({
                id: rooms.id,
                roomNumber: rooms.roomNumber,
                hostelName: rooms.hostelName,
                capacity: rooms.capacity,
                floor: rooms.floor,
                status: rooms.status,
                occupantCount: sql<number>`(
                    SELECT COUNT(*)::int
                    FROM ${roomAssignments}
                    WHERE ${roomAssignments.roomId} = ${rooms.id}
                    AND ${roomAssignments.status} = 'active'
                )`,
            })
            .from(rooms)
            .orderBy(rooms.hostelName, rooms.roomNumber);

        return rows;
    } catch (err) {
        console.error("getRooms - DB query failed:", err);
        return [];
    }
}
