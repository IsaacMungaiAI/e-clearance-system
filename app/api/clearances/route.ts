import { NextResponse } from 'next/server';
import { getPendingClearances } from '@/app/actions/registrar/clearance-request';

export async function GET() {
    try {
        const data = await getPendingClearances();
        return NextResponse.json(data);
    } catch (err) {
        console.error('API /api/clearances GET error:', err);
        return NextResponse.json({ error: 'Failed to load clearances' }, { status: 500 });
    }
}
