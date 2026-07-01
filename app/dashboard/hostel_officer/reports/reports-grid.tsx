"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, Download } from "lucide-react";

const reports = [
    {
        id: "occupancy",
        title: "Occupancy Report",
        desc: "Current hostel occupancy by block and room type.",
    },
    {
        id: "clearance-summary",
        title: "Clearance Summary",
        desc: "Completed and pending hostel clearances for the term.",
    },
    {
        id: "maintenance",
        title: "Maintenance Log",
        desc: "All reported and resolved maintenance issues.",
    },
    {
        id: "resident-register",
        title: "Resident Register",
        desc: "Full list of checked-in residents with room details.",
    },
];

export function ReportsGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => (
                <Card key={report.id}>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileBarChart className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">
                                {report.title}
                            </CardTitle>
                        </div>
                        <CardDescription>{report.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                                const a = document.createElement("a");
                                a.href = `/api/hostel-officer/reports/${report.id}`;
                                a.download = `${report.id}.csv`;
                                a.click();
                            }}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
