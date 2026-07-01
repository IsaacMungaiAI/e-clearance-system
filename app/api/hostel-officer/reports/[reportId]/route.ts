import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import {
    profiles,
    clearanceSteps,
    clearanceRequests,
    departments,
    rooms,
    roomAssignments,
} from "@/app/db/schema";
import { and, eq, desc, isNotNull, isNull } from "drizzle-orm";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ reportId: string }> }
) {
    try {
        const { reportId } = await params;

        const hostelDept = await db
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.name, "Hostel"))
            .limit(1);

        const hostelDepartmentId = hostelDept[0]?.id;
        if (!hostelDepartmentId) {
            return NextResponse.json(
                { error: "Hostel department not found" },
                { status: 404 }
            );
        }

        let data: Record<string, unknown>[] = [];

        switch (reportId) {
            case "occupancy": {
                const occupancy = await db
                    .select({
                        roomNumber: rooms.roomNumber,
                        hostelName: rooms.hostelName,
                        capacity: rooms.capacity,
                        occupantCount: roomAssignments.id,
                        studentName: profiles.fullName,
                        checkInDate: roomAssignments.checkInDate,
                    })
                    .from(rooms)
                    .leftJoin(
                        roomAssignments,
                        and(
                            eq(roomAssignments.roomId, rooms.id),
                            eq(roomAssignments.status, "active")
                        )
                    )
                    .leftJoin(
                        profiles,
                        eq(roomAssignments.studentId, profiles.id)
                    )
                    .orderBy(rooms.hostelName, rooms.roomNumber);

                data = occupancy;
                break;
            }
            case "clearance-summary": {
                const steps = await db
                    .select({
                        studentName: profiles.fullName,
                        status: clearanceSteps.status,
                        comment: clearanceSteps.comment,
                        updatedAt: clearanceSteps.updatedAt,
                    })
                    .from(clearanceSteps)
                    .innerJoin(
                        clearanceRequests,
                        eq(
                            clearanceSteps.clearanceRequestId,
                            clearanceRequests.id
                        )
                    )
                    .innerJoin(
                        profiles,
                        eq(clearanceRequests.studentId, profiles.id)
                    )
                    .where(
                        eq(
                            clearanceSteps.departmentId,
                            hostelDepartmentId
                        )
                    )
                    .orderBy(desc(clearanceSteps.updatedAt));

                data = steps;
                break;
            }
            case "maintenance": {
                data = [] as Record<string, unknown>[];
                break;
            }
            case "resident-register": {
                const register = await db
                    .select({
                        studentName: profiles.fullName,
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
                    .where(eq(roomAssignments.status, "active"))
                    .orderBy(rooms.hostelName, rooms.roomNumber);

                data = register;
                break;
            }
            default:
                return NextResponse.json(
                    { error: "Unknown report type" },
                    { status: 400 }
                );
        }

        const csvHeader =
            Object.keys(data[0] ?? {}).join(",");
        const csvRows = data
            .map((row) =>
                Object.values(row)
                    .map((val) => {
                        if (val instanceof Date)
                            return val.toISOString();
                        if (val === null || val === undefined)
                            return "";
                        const s = String(val);
                        return s.includes(",")
                            ? `"${s}"`
                            : s;
                    })
                    .join(",")
            )
            .join("\n");
        const csv = `${csvHeader}\n${csvRows}`;

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${reportId}.csv"`,
            },
        });
    } catch (err) {
        console.error(
            "API /api/hostel-officer/reports GET error:",
            err
        );
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}
