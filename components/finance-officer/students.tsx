'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Student = {
    id: string;
    fullName: string | null;
    feeStatus: string;
    updatedAt: string | null;
};

const statusIcon: Record<string, React.ReactNode> = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
        approved: <CheckCircle2 className="h-4 w-4 text-primary" />,
    rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
};

export function Students() {
    const [data, setData] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;

    const columns = useMemo<ColumnDef<Student>[]>(
        () => [
            {
                accessorKey: 'fullName',
                header: 'Student Name',
                cell: (info) => info.getValue() ?? 'Unknown',
            },
            {
                accessorKey: 'feeStatus',
                header: 'Fee Status',
                cell: (info) => {
                    const status = info.getValue() as string;
                    return (
                        <Badge variant={statusVariant[status] ?? 'outline'}>
                            <span className="flex items-center gap-1">
                                {statusIcon[status]}
                                {status}
                            </span>
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'updatedAt',
                header: 'Last Updated',
                cell: (info) => {
                    const val = info.getValue() as string | null;
                    return val
                        ? new Date(val).toLocaleDateString()
                        : '-';
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        pageCount: Math.ceil(data.length / pageSize) || 1,
        state: { pagination: { pageIndex, pageSize } },
        onPaginationChange: (updater) => {
            const next =
                typeof updater === 'function'
                    ? updater({ pageIndex, pageSize })
                    : updater;
            setPageIndex(next.pageIndex ?? pageIndex);
        },
        manualPagination: true,
    });

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        const page = pageIndex + 1;
        fetch(
            `/api/finance-officer/students?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`
        )
            .then((r) => r.json())
            .then((res) => {
                if (!mounted) return;
                setData(Array.isArray(res.rows) ? res.rows : []);
            })
            .catch(() => {
                if (!mounted) return;
                setData([]);
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [q, pageIndex]);

    const filtered = useMemo(() => {
        if (!q.trim()) return data;
        const lower = q.toLowerCase();
        return data.filter((s) =>
            s.fullName?.toLowerCase().includes(lower)
        );
    }, [data, q]);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle>Student Fee Status</CardTitle>
                    <Input
                        placeholder="Search students..."
                        value={q}
                        onChange={(e) => {
                            setQ(e.target.value);
                            setPageIndex(0);
                        }}
                        className="max-w-xs"
                    />
                </div>
            </CardHeader>

            <CardContent>
                {loading && (
                    <p className="text-sm text-muted-foreground py-4">Loading…</p>
                )}

                {!loading && filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4">
                        No students found.
                    </p>
                )}

                {!loading && filtered.length > 0 && (
                    <>
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {data.length} of {data.length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setPageIndex(Math.max(0, pageIndex - 1))
                                    }
                                    disabled={pageIndex === 0}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageIndex(pageIndex + 1)}
                                    disabled={data.length < pageSize}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
