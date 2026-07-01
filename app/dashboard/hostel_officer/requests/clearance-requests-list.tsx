"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { updateClearanceStep } from "@/app/actions/hostel-officer/update-clearance-step";
import { useRouter } from "next/navigation";

interface ClearanceRequest {
    id: string;
    clearanceRequestId: string | null;
    status: string | null;
    comment: string | null;
    updatedAt: Date | null;
    studentId: string | null;
    studentName: string | null;
}

interface Props {
    requests: ClearanceRequest[];
}

export function ClearanceRequestsList({ requests }: Props) {
    const router = useRouter();
    const [comment, setComment] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [action, setAction] = useState<"approved" | "rejected" | null>(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const pending = requests.filter((r) => r.status === "pending");
    const processed = requests.filter((r) => r.status !== "pending");

    async function handleConfirm() {
        if (!selectedId || !action) return;
        setLoading(true);
        try {
            await updateClearanceStep(selectedId, action, comment || undefined);
            setOpen(false);
            setComment("");
            router.refresh();
        } catch {
            setLoading(false);
        }
    }

    function openDialog(id: string, actionType: "approved" | "rejected") {
        setSelectedId(id);
        setAction(actionType);
        setComment("");
        setOpen(true);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        <CardTitle>Clearance Requests</CardTitle>
                        <Badge variant="default" className="ml-2">
                            {pending.length}
                        </Badge>
                    </div>
                    <CardDescription>
                        Students requesting hostel clearance approval.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {pending.length === 0 && processed.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No clearance requests found.
                        </p>
                    )}

                    {pending.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                Pending Review
                            </h3>
                            <div className="space-y-3">
                                {pending.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {req.studentName ?? "Unknown"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Submitted{" "}
                                                {req.updatedAt
                                                    ? new Date(
                                                          req.updatedAt
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="mr-2"
                                            >
                                                Pending
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-primary border-primary/30"
                                                onClick={() =>
                                                    openDialog(
                                                        req.id,
                                                        "approved"
                                                    )
                                                }
                                            >
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive border-destructive/30"
                                                onClick={() =>
                                                    openDialog(
                                                        req.id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {processed.length > 0 && (
                        <div>
                            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                                Processed
                            </h3>
                            <div className="space-y-3">
                                {processed.map((req) => (
                                    <div
                                        key={req.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {req.studentName ?? "Unknown"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Updated{" "}
                                                {req.updatedAt
                                                    ? new Date(
                                                          req.updatedAt
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                req.status === "approved"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {req.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {action === "approved"
                                ? "Approve Clearance"
                                : "Reject Clearance"}
                        </DialogTitle>
                        <DialogDescription>
                            {action === "approved"
                                ? "Confirm approval of this hostel clearance request."
                                : "Provide a reason for rejecting this clearance request."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <Textarea
                            placeholder={
                                action === "rejected"
                                    ? "Reason for rejection..."
                                    : "Optional comment..."
                            }
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={
                                action === "approved" ? "default" : "destructive"
                            }
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : action === "approved"
                                  ? "Approve"
                                  : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
