import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

export default async function StudentDashboard() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch clearance steps
  const { data: steps } = await supabase
    .from("clearance_steps")
    .select(`
      id,
      status,
      comment,
      departments (name)
    `)
    .eq("student_id", user?.id);

  const total = steps?.length || 0;
  const approved =
    steps?.filter((s) => s.status === "approved").length || 0;

  const progress = total ? (approved / total) * 100 : 0;

  return (
    <div className="p-6 space-y-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-green-800">
          Student Dashboard
        </h1>
        <Badge className="bg-green-600">
          {progress === 100 ? "Completed" : "In Progress"}
        </Badge>
      </div>

      {/* Progress Card */}
      <Card className="border-green-100 shadow-sm">
        <CardHeader>
          <CardTitle>Clearance Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {approved} of {total} departments cleared
          </p>
        </CardContent>
      </Card>

      {/* Departments */}
      <Card className="border-green-100 shadow-sm">
        <CardHeader>
          <CardTitle>Department Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps?.map((step) => (
            <div
              key={step.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">
                  {step.departments?.[0]?.name}
                </p>
                {step.comment && (
                  <p className="text-sm text-muted-foreground">
                    {step.comment}
                  </p>
                )}
              </div>

              <StatusBadge status={step.status} />
            </div>
          ))}
        </CardContent>
      </Card>
     <form action={logout}>
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Logout
      </button>
    </form>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-green-600",
    pending: "bg-yellow-500",
    rejected: "bg-red-500",
  };

  return (
    <span
      className={`text-white text-xs px-3 py-1 rounded-full ${map[status]}`}
    >
      {status}
    </span>
  );
}