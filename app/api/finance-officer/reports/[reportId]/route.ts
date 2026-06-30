import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/db';
import {
    profiles,
    clearanceSteps,
    clearanceRequests,
    departments,
} from '@/app/db/schema';
import { and, eq, desc } from 'drizzle-orm';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ reportId: string }> }
) {
    try {
        const { reportId } = await params;
        const url = new URL(req.url);
        const period = url.searchParams.get('period') || 'all';

        const financeDept = await db
            .select({ id: departments.id })
            .from(departments)
            .where(eq(departments.name, 'Finance'))
            .limit(1);

        const financeDepartmentId = financeDept[0]?.id;
        if (!financeDepartmentId) {
            return NextResponse.json(
                { error: 'Finance department not found' },
                { status: 404 }
            );
        }

        let data: Record<string, unknown>[] = [];

        switch (reportId) {
            case 'fee-clearance-summary': {
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
                            financeDepartmentId
                        )
                    )
                    .orderBy(desc(clearanceSteps.updatedAt));

                data = steps;
                break;
            }
            case 'pending-fees': {
                const pending = await db
                    .select({
                        studentName: profiles.fullName,
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
                        and(
                            eq(
                                clearanceSteps.departmentId,
                                financeDepartmentId
                            ),
                            eq(clearanceSteps.status, 'pending')
                        )
                    )
                    .orderBy(desc(clearanceSteps.updatedAt));

                data = pending;
                break;
            }
            case 'cleared-students': {
                const cleared = await db
                    .select({
                        studentName: profiles.fullName,
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
                        and(
                            eq(
                                clearanceSteps.departmentId,
                                financeDepartmentId
                            ),
                            eq(clearanceSteps.status, 'approved')
                        )
                    )
                    .orderBy(desc(clearanceSteps.updatedAt));

                data = cleared;
                break;
            }
            case 'fee-audit-trail': {
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
                            financeDepartmentId
                        )
                    )
                    .orderBy(desc(clearanceSteps.updatedAt));

                data = steps;
                break;
            }
            default:
                return NextResponse.json(
                    { error: 'Unknown report type' },
                    { status: 400 }
                );
        }

        const csvHeader =
            Object.keys(data[0] ?? {}).join(',');
        const csvRows = data
            .map((row) =>
                Object.values(row)
                    .map((val) => {
                        if (val instanceof Date)
                            return val.toISOString();
                        if (val === null || val === undefined)
                            return '';
                        const s = String(val);
                        return s.includes(',')
                            ? `"${s}"`
                            : s;
                    })
                    .join(',')
            )
            .join('\n');
        const csv = `${csvHeader}\n${csvRows}`;

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${reportId}.csv"`,
            },
        });
    } catch (err) {
        console.error(
            'API /api/finance-officer/reports GET error:',
            err
        );
        return NextResponse.json(
            { error: 'Failed to generate report' },
            { status: 500 }
        );
    }
}
