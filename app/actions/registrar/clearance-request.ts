import { db } from "@/app/db";
import { clearanceRequests, profiles } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function getPendingClearances() {
    return db
        .select({
            id: clearanceRequests.id,
            studentName: profiles.fullName,
            status: clearanceRequests.status,
            createdAt: clearanceRequests.createdAt,
        })
        .from(clearanceRequests)
        .leftJoin(
            profiles,
            eq(clearanceRequests.studentId, profiles.id)
        );
}