'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    approved: "default",
    rejected: "destructive",
};

type FeeClearance = {
    id: string;
    studentName: string | null;
    studentId: string;
    status: string;
    comment: string | null;
    updatedAt: string | null;
    clearanceRequestId: string;
};

export function FeeClearances() {
    const [clearances, setClearances] = useState<FeeClearance[]>([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState('');
    const [selected, setSelected] = useState<FeeClearance | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionComment, setActionComment] = useState('');
    const [processing, setProcessing] = useState(false);

    const fetchClearances = () => {
        setLoading(true);
        fetch(`/api/finance-officer/clearances?q=${encodeURIComponent(q)}`)
            .then((r) => r.json())
            .then((res) => {
                setClearances(Array.isArray(res) ? res : []);
            })
            .catch(() => setClearances([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchClearances();
    }, [q]);

    const handleAction = async (action: 'approved' | 'rejected') => {
        if (!selected) return;
        setProcessing(true);
        try {
            const res = await fetch('/api/finance-officer/clearances', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stepId: selected.id,
                    status: action,
                    comment: actionComment,
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error ?? 'Failed to update');
            }
            toast.success(
                action === 'approved'
                    ? 'Fee clearance approved'
                    : 'Fee clearance rejected'
            );
            setDialogOpen(false);
            setSelected(null);
            setActionComment('');
            fetchClearances();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Something went wrong';
            toast.error(message);
        } finally {
            setProcessing(false);
        }
    };

    const filtered = useMemo(() => {
        if (!q.trim()) return clearances;
        const lower = q.toLowerCase();
        return clearances.filter((c) =>
            c.studentName?.toLowerCase().includes(lower)
        );
    }, [clearances, q]);

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <CardTitle>Fee Clearance Requests</CardTitle>
                        <Input
                            placeholder="Search by student name..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            className="max-w-xs"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading && (
                        <p className="text-sm text-muted-foreground py-4">
                            Loading…
                        </p>
                    )}

                    {!loading && filtered.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4">
                            No fee clearance requests found.
                        </p>
                    )}

                    {!loading && filtered.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">
                                            {c.studentName ?? 'Unknown Student'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    statusVariant[c.status] ??
                                                    'outline'
                                                }
                                            >
                                                {c.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {c.updatedAt
                                                ? new Date(
                                                      c.updatedAt
                                                  ).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setSelected(c);
                                                    setActionComment(
                                                        c.comment ?? ''
                                                    );
                                                    setDialogOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review Fee Clearance</DialogTitle>
                        <DialogDescription>
                            Review the fee clearance request and approve or
                            reject it.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Student</p>
                            <p className="text-sm text-muted-foreground">
                                {selected?.studentName ?? 'Unknown'}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium">Current Status</p>
                            <Badge
                                variant={
                                    statusVariant[selected?.status ?? ''] ??
                                    'outline'
                                }
                            >
                                {selected?.status}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium">Comment</p>
                            <Textarea
                                placeholder="Add a comment..."
                                value={actionComment}
                                onChange={(e) =>
                                    setActionComment(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleAction('rejected')}
                            disabled={processing}
                        >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                        </Button>
                        <Button
                            onClick={() => handleAction('approved')}
                            disabled={processing}
                        >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
