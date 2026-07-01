import { db } from "@/app/db";
import {
    profiles,
    clearanceRequests,
    clearanceSteps,
    departments,
    rooms,
    roomAssignments,
} from "@/app/db/schema";
import { and, count, eq } from "drizzle-orm";

export async function getDashboardStats() {
    try {
        const [studentCount, hostelDept, roomCount, activeAssignments] =
            await Promise.all([
                db
                    .select({ count: count() })
                    .from(profiles)
                    .where(eq(profiles.role, "student")),

                db
                    .select({ id: departments.id })
                    .from(departments)
                    .where(eq(departments.name, "Hostel"))
                    .limit(1),

                db
                    .select({ count: count() })
                    .from(rooms),

                db
                    .select({ count: count() })
                    .from(roomAssignments)
                    .where(eq(roomAssignments.status, "active")),
            ]);

        const hostelDepartmentId = hostelDept[0]?.id;

        let pending = 0;
        let approved = 0;
        let rejected = 0;

        if (hostelDepartmentId) {
            const [pendingResult, approvedResult, rejectedResult] =
                await Promise.all([
                    db
                        .select({ count: count() })
                        .from(clearanceSteps)
                        .where(
                            and(
                                eq(
                                    clearanceSteps.departmentId,
                                    hostelDepartmentId
                                ),
                                eq(clearanceSteps.status, "pending")
                            )
                        ),

                    db
                        .select({ count: count() })
                        .from(clearanceSteps)
                        .where(
                            and(
                                eq(
                                    clearanceSteps.departmentId,
                                    hostelDepartmentId
                                ),
                                eq(clearanceSteps.status, "approved")
                            )
                        ),

                    db
                        .select({ count: count() })
                        .from(clearanceSteps)
                        .where(
                            and(
                                eq(
                                    clearanceSteps.departmentId,
                                    hostelDepartmentId
                                ),
                                eq(clearanceSteps.status, "rejected")
                            )
                        ),
                ]);

            pending = pendingResult[0]?.count ?? 0;
            approved = approvedResult[0]?.count ?? 0;
            rejected = rejectedResult[0]?.count ?? 0;
        }

        const totalClearancesResult = await db
            .select({ count: count() })
            .from(clearanceRequests);

        return {
            stats: {
                students: studentCount[0]?.count ?? 0,
                pending,
                approved,
                rejected,
                totalClearances: totalClearancesResult[0]?.count ?? 0,
                totalRooms: Number(roomCount[0]?.count ?? 0),
                occupiedRooms: Number(activeAssignments[0]?.count ?? 0),
            },
        };
    } catch (err) {
        console.error("getHostelDashboardStats - DB query failed:", err);
        return {
            stats: {
                students: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                totalClearances: 0,
                totalRooms: 0,
                occupiedRooms: 0,
            },
        };
    }
}
