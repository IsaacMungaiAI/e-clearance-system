import { NextResponse } from 'next/server';
import { listStudents } from '@/app/actions/registrar/list-students';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get('q') || '';
        const page = Number(url.searchParams.get('page') || '1');
        const pageSize = Number(url.searchParams.get('pageSize') || '10');
        const sortField = url.searchParams.get('sortField') || 'createdAt';
        const sortDir = (url.searchParams.get('sortDir') as 'asc' | 'desc') || 'desc';

        const result = await listStudents({ q, page, pageSize, sortField, sortDir });
        return NextResponse.json(result);
    } catch (err) {
        console.error('API /api/students/list GET error:', err);
        return NextResponse.json({ error: 'Failed to list students' }, { status: 500 });
    }
}
