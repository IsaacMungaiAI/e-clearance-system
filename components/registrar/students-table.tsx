import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';

type Profile = {
    id: string;
    fullName?: string | null;
    role?: string | null;
    createdAt?: string | null;
};

export function StudentsTable() {
    const [q, setQ] = useState('');
    const [data, setData] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const columns = useMemo<ColumnDef<Profile, any>[]>(() => [
        {
            accessorKey: 'fullName',
            header: 'Name',
        },
        {
            accessorKey: 'role',
            header: 'Role',
        },
        {
            accessorKey: 'createdAt',
            header: 'Joined',
            cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleString() : '-',
        },
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: Math.ceil(total / pageSize) || 1,
        state: { pagination: { pageIndex, pageSize } as any },
        onPaginationChange: (updater) => {
            const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
            setPageIndex(next.pageIndex ?? pageIndex);
            setPageSize(next.pageSize ?? pageSize);
        },
    });

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const page = pageIndex + 1;

        fetch(`/api/students/list?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`)
            .then((r) => r.json())
            .then((res) => {
                if (!mounted) return;
                setData(Array.isArray(res.rows) ? res.rows : []);
                setTotal(Number(res.total ?? 0));
            })
            .catch(() => {
                if (!mounted) return;
                setData([]);
                setTotal(0);
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, [q, pageIndex, pageSize]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Student Management
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Input
                        placeholder="Search students..."
                        value={q}
                        onChange={(e) => { setQ(e.target.value); setPageIndex(0); }}
                        className="flex-1"
                    />
                </div>

                <div className="mt-4">
                    {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map(row => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">{`Showing ${data.length} of ${total}`}</div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                                disabled={pageIndex === 0}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageIndex(pageIndex + 1)}
                                disabled={(pageIndex + 1) * pageSize >= total}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}