import { db } from "@/app/db";
import {
    profiles,
    roomAssignments,
    rooms,
    clearanceSteps,
    clearanceRequests,
    departments,
} from "@/app/db/schema";
import { and, eq, ilike, count, desc, asc } from "drizzle-orm";

type ListParams = {
    q?: string;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortDir?: "asc" | "desc";
};

export async function getResidents({
    q = "",
    page = 1,
    pageSize = 10,
    sortField = "fullName",
    sortDir = "asc",
}: ListParams = {}) {
    try {
        const offset = Math.max(0, (page - 1) * pageSize);

        const whereClause = and(
            eq(roomAssignments.status, "active"),
            q ? ilike(profiles.fullName, `%${q}%`) : undefined
        );

        const rows = await db
            .select({
                id: roomAssignments.id,
                studentId: profiles.id,
                studentName: profiles.fullName,
                roomId: rooms.id,
                roomNumber: rooms.roomNumber,
                hostelName: rooms.hostelName,
                checkInDate: roomAssignments.checkInDate,
            })
            .from(roomAssignments)
            .innerJoin(
                profiles,
                eq(roomAssignments.studentId, profiles.id)
            )
            .innerJoin(
                rooms,
                eq(roomAssignments.roomId, rooms.id)
            )
            .where(whereClause)
            .orderBy(
                sortDir === "asc"
                    ? asc(profiles.fullName)
                    : desc(profiles.fullName)
            )
            .limit(pageSize)
            .offset(offset);

        const totalRes = await db
            .select({ count: count() })
            .from(roomAssignments)
            .innerJoin(
                profiles,
                eq(roomAssignments.studentId, profiles.id)
            )
            .where(whereClause);

        return {
            rows,
            total: Number(totalRes[0]?.count ?? 0),
            page,
            pageSize,
        };
    } catch (err) {
        console.error("getResidents - DB query failed:", err);
        return { rows: [], total: 0, page, pageSize };
    }
}
