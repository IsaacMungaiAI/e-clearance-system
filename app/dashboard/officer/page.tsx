"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // optional for feedback

type Step = {
  id: string;
  status: "pending" | "approved" | "rejected";
  comment: string | null;
  clearance_request: {
    id: string;
    profiles: { full_name: string };
  };
};

export default function OfficerDashboard() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});

  const supabase = createClient();

  async function fetchSteps() {
    setLoading(true);
    const { data } = await supabase
      .from("clearance_steps")
      .select(`
      id,
      status,
      comment,
      clearance_request (
        id,
        profiles (full_name)
      )
    `)
      .eq("department_id", "<OFFICER_DEPT_ID>");

    if (data) {
      const mapped: Step[] = data.map((step: any) => ({
        id: step.id,
        status: step.status,
        comment: step.comment,
        clearance_request: {
          id: step.clearance_request.id,
          profiles: step.clearance_request.profiles[0], // take the first profile
        },
      }));
      setSteps(mapped);
    }

    setLoading(false);
  }

  async function handleApprove(stepId: string) {
    const { error } = await supabase
      .from("clearance_steps")
      .update({ status: "approved", comment: null, updated_at: new Date() })
      .eq("id", stepId);

    if (error) return toast.error("Failed to approve step");
    toast.success("Approved successfully");
    fetchSteps();
  }

  async function handleReject(stepId: string) {
    const comment = commentMap[stepId];
    if (!comment) return toast.error("Comment required to reject");

    const { error } = await supabase
      .from("clearance_steps")
      .update({ status: "rejected", comment, updated_at: new Date() })
      .eq("id", stepId);

    if (error) return toast.error("Failed to reject step");
    toast.success("Rejected successfully");
    fetchSteps();
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-700">Officer Dashboard</h1>

      {loading ? (
        <p>Loading students...</p>
      ) : steps.length === 0 ? (
        <p>No clearance steps assigned yet.</p>
      ) : (
        steps.map((step) => (
          <Card key={step.id} className="border-green-300">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{step.clearance_request.profiles.full_name}</span>
                <Badge
                  variant={
                    step.status === "approved"
                      ? "success"
                      : step.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {step.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {step.status === "pending" && (
                <>
                  <Textarea
                    placeholder="Add comment if rejecting"
                    value={commentMap[step.id] || ""}
                    onChange={(e) =>
                      setCommentMap((prev) => ({
                        ...prev,
                        [step.id]: e.target.value,
                      }))
                    }
                    className="mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleApprove(step.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(step.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </>
              )}
              {step.status === "rejected" && (
                <p>
                  <strong>Reason:</strong> {step.comment || "No comment"}
                </p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}