import { db } from '@/app/db';
import { profiles } from '@/app/db/schema';
import { ilike, asc, desc, count, and, eq } from 'drizzle-orm';

type ListParams = {
    q?: string;
    page?: number;
    pageSize?: number;
    sortField?: string;
    sortDir?: 'asc' | 'desc';
};

export async function listStudents({ q = '', page = 1, pageSize = 10, sortField = 'createdAt', sortDir = 'desc' }: ListParams) {
    const where = and(
        eq(profiles.role, 'student'),
        q ? ilike(profiles.fullName, `%${q}%`) : undefined
    );
    const offset = Math.max(0, (page - 1) * pageSize);

    const rows = await db
        .select()
        .from(profiles)
        .where(where)
        .orderBy(sortDir === 'asc' ? asc((profiles as any)[sortField]) : desc((profiles as any)[sortField]))
        .limit(pageSize)
        .offset(offset);

    const totalRes = await db.select({ count: count() }).from(profiles).where(where);

    return {
        rows,
        total: Number(totalRes[0]?.count ?? 0),
        page,
        pageSize,
    };
}
