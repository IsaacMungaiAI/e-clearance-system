import { NextResponse } from 'next/server';
import { searchStudents } from '@/app/actions/registrar/search-students';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get('q') || '';
        const results = await searchStudents(q);
        return NextResponse.json(results);
    } catch (err) {
        console.error('API /api/students/search GET error:', err);
        return NextResponse.json({ error: 'Failed to search students' }, { status: 500 });
    }
}
