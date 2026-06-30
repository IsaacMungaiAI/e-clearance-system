import { NextRequest, NextResponse } from 'next/server';
import { getStudentsFeeStatus } from '@/app/actions/finance-officer/get-students-fee-status';

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get('q') || '';
        const page = Number(url.searchParams.get('page') || '1');
        const pageSize = Number(url.searchParams.get('pageSize') || '10');

        const result = await getStudentsFeeStatus({ q, page, pageSize });
        return NextResponse.json(result);
    } catch (err) {
        console.error('API /api/finance-officer/students GET error:', err);
        return NextResponse.json(
            { error: 'Failed to load students' },
            { status: 500 }
        );
    }
}
