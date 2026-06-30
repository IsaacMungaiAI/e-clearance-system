import { NextRequest, NextResponse } from 'next/server';
import { getFeeClearances } from '@/app/actions/finance-officer/get-fee-clearances';
import { updateClearanceStep } from '@/app/actions/finance-officer/update-clearance-step';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get('q') || '';
        const data = await getFeeClearances(q);
        return NextResponse.json(data);
    } catch (err) {
        console.error('API /api/finance-officer/clearances GET error:', err);
        return NextResponse.json(
            { error: 'Failed to load fee clearances' },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { stepId, status, comment } = body;

        if (!stepId || !status) {
            return NextResponse.json(
                { error: 'stepId and status are required' },
                { status: 400 }
            );
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'status must be approved or rejected' },
                { status: 400 }
            );
        }

        const result = await updateClearanceStep(stepId, status, comment);
        return NextResponse.json(result);
    } catch (err) {
        console.error('API /api/finance-officer/clearances PATCH error:', err);
        return NextResponse.json(
            { error: 'Failed to update clearance step' },
            { status: 500 }
        );
    }
}
