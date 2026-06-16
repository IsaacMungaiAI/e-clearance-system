import { db } from "@/app/db";
import {
    profiles,
    clearanceRequests,
} from "@/app/db/schema";

import {
    count,
    eq,
    or,
} from "drizzle-orm";

export async function getDashboardStats() {
    try {
        const [students, pending, approved, officers] = await Promise.all([
            db.select({ count: count() }).from(profiles).where(eq(profiles.role, "student")),

            db
                .select({ count: count() })
                .from(clearanceRequests)
                .where(eq(clearanceRequests.status, "pending")),

            db
                .select({ count: count() })
                .from(clearanceRequests)
                .where(eq(clearanceRequests.status, "approved")),

            db
                .select({ count: count() })
                .from(profiles)
                .where(
                    or(
                        eq(profiles.role, "officer_library"),
                        eq(profiles.role, "officer_finance"),
                        eq(profiles.role, "officer_hostel")
                    )
                ),
        ]);

        return {
            stats: {
                students: students[0]?.count ?? 0,
                pending: pending[0]?.count ?? 0,
                approved: approved[0]?.count ?? 0,
                officers: officers[0]?.count ?? 0,
            },
        };
    } catch (err) {
        // Log the original error for debugging and return safe defaults so the UI remains available
        // Server-side logs will contain the stack and cause (e.g., ECONNRESET)
        console.error("getDashboardStats - DB query failed:", err);
        return {
            stats: {
                students: 0,
                pending: 0,
                approved: 0,
                officers: 0,
            },
        };
    }
}