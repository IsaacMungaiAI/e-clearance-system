"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClearanceRow = {
    id: string;
    studentName?: string | null;
    status?: string | null;
    createdAt?: string | null;
};

export function ClearanceTable() {
    const [rows, setRows] = useState<ClearanceRow[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        fetch('/api/clearances')
            .then((r) => r.json())
            .then((data) => {
                if (!mounted) return;
                setRows(Array.isArray(data) ? data : []);
            })
            .catch(() => setRows([]))
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return <p className="text-sm text-muted-foreground">Loading pending clearances…</p>;
    }

    if (!rows || rows.length === 0) {
        return <p className="text-sm text-muted-foreground">No pending clearances.</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Clearances</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.studentName ?? 'Unknown'}</TableCell>
                                <TableCell>{r.status ?? '—'}</TableCell>
                                <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}