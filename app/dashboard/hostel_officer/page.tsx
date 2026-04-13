"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";

// Shadcn UI
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

// Lucide Icons
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  Building2,
  MoreHorizontal,
  RefreshCw,
  ChevronRight,
  Users,
  ShieldCheck,
} from "lucide-react";

type Step = {
  id: string;
  status: "pending" | "approved" | "rejected";
  comment: string | null;
  clearance_request: {
    id: string;
    profiles: { full_name: string };
  };
};

type Tab = "overview" | "requests";

export default function OfficerDashboard() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    stepId: string | null;
  }>({ open: false, stepId: null });
  const [rejectComment, setRejectComment] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [officerName, setOfficerName] = useState("Officer");
  const [officerEmail, setOfficerEmail] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchSteps();
  }, []);

  async function fetchSteps() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("department_id, full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) setOfficerName(profile.full_name);
    if (user.email) setOfficerEmail(user.email);

    if (!profile?.department_id) {
      toast.error("No department assigned to this officer");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("clearance_steps")
      .select(`
        id, status, comment,
        clearance_request (
          id,
          profiles (full_name)
        )
      `)
      .eq("department_id", profile.department_id);

    if (data) {
      const mapped: Step[] = data.map((step: any) => ({
        id: step.id,
        status: step.status,
        comment: step.comment,
        clearance_request: {
          id: step.clearance_request.id,
          profiles: Array.isArray(step.clearance_request.profiles)
            ? step.clearance_request.profiles[0]
            : step.clearance_request.profiles,
        },
      }));
      setSteps(mapped);
    }

    setLoading(false);
  }

  async function handleApprove(stepId: string) {
    setActionLoading(stepId);
    const { error } = await supabase
      .from("clearance_steps")
      .update({ status: "approved", comment: null, updated_at: new Date() })
      .eq("id", stepId);

    if (error) toast.error("Failed to approve");
    else toast.success("Student cleared successfully");
    await fetchSteps();
    setActionLoading(null);
  }

  async function handleRejectConfirm() {
    if (!rejectDialog.stepId) return;
    if (!rejectComment.trim()) {
      toast.error("A reason is required when rejecting");
      return;
    }
    setActionLoading(rejectDialog.stepId);
    const { error } = await supabase
      .from("clearance_steps")
      .update({
        status: "rejected",
        comment: rejectComment,
        updated_at: new Date(),
      })
      .eq("id", rejectDialog.stepId);

    if (error) toast.error("Failed to reject");
    else toast.success("Request rejected");
    setRejectDialog({ open: false, stepId: null });
    setRejectComment("");
    setActionLoading(null);
    await fetchSteps();
  }

  const pending = steps.filter((s) => s.status === "pending");
  const approved = steps.filter((s) => s.status === "approved");
  const rejected = steps.filter((s) => s.status === "rejected");

  const initials = officerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#f5f5f0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

          {/* ── SIDEBAR ── */}
          <Sidebar className="border-r-0 shadow-xl">
            <SidebarHeader className="bg-[#1a4731] px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                    KAFU Clearance
                  </p>
                  <p className="text-emerald-400/70 text-[11px] mt-1 tracking-wide uppercase">
                    Hostel Portal
                  </p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="bg-[#1a4731]">
              <SidebarGroup className="px-3 py-4">
                <SidebarGroupLabel className="text-emerald-400/50 text-[10px] tracking-[0.2em] uppercase px-2 mb-2">
                  Navigation
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "overview"}
                        onClick={() => setActiveTab("overview")}
                        className="text-emerald-100/80 hover:text-white hover:bg-emerald-400/10 data-[active=true]:bg-emerald-400/15 data-[active=true]:text-white rounded-lg h-10"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Overview</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeTab === "requests"}
                        onClick={() => setActiveTab("requests")}
                        className="text-emerald-100/80 hover:text-white hover:bg-emerald-400/10 data-[active=true]:bg-emerald-400/15 data-[active=true]:text-white rounded-lg h-10"
                      >
                        <ClipboardList className="w-4 h-4" />
                        <span>Requests</span>
                        {pending.length > 0 && (
                          <SidebarMenuBadge className="bg-amber-400 text-amber-900 font-bold text-[10px]">
                            {pending.length}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarSeparator className="bg-emerald-400/10 mx-4" />

              {/* Quick Stats */}
              <SidebarGroup className="px-3 py-4">
                <SidebarGroupLabel className="text-emerald-400/50 text-[10px] tracking-[0.2em] uppercase px-2 mb-3">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-2 px-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-emerald-100/70">Pending</span>
                      </div>
                      <span className="text-white font-semibold">{pending.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-100/70">Approved</span>
                      </div>
                      <span className="text-white font-semibold">{approved.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                        <span className="text-emerald-100/70">Rejected</span>
                      </div>
                      <span className="text-white font-semibold">{rejected.length}</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-[#163d2b] border-t border-emerald-400/10 p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border-2 border-emerald-400/30">
                  <AvatarFallback className="bg-emerald-700 text-emerald-100 text-sm font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate leading-none mb-1">
                    {officerName}
                  </p>
                  <p className="text-emerald-400/60 text-[11px] truncate">
                    {officerEmail || "Hostel Officer"}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger>
                    <form action={logout}>
                      <button
                        type="submit"
                        className="p-1.5 rounded-md text-emerald-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </form>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Sign out</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 flex flex-col min-w-0">

            {/* Top bar */}
            <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-stone-500 hover:text-stone-800" />
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <span>Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-stone-800 font-medium capitalize">{activeTab}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSteps}
                className="text-stone-500 hover:text-stone-800 gap-2 text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </header>

            <ScrollArea className="flex-1">
              <div className="p-8 max-w-6xl mx-auto space-y-8">

                {/* Page title */}
                <div>
                  <h1
                    className="text-2xl font-bold text-stone-800 leading-none"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {activeTab === "overview" ? "Dashboard Overview" : "Clearance Requests"}
                  </h1>
                  <p className="text-stone-400 text-sm mt-1.5">
                    {activeTab === "overview"
                      ? "Your hostel clearance summary at a glance"
                      : `${pending.length} pending review`}
                  </p>
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === "overview" && (
                  <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border-stone-200 shadow-none bg-white">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Pending</p>
                              {loading ? (
                                <Skeleton className="h-9 w-12 mt-1" />
                              ) : (
                                <p className="text-4xl font-bold text-amber-500 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {pending.length}
                                </p>
                              )}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                              <Clock className="w-5 h-5 text-amber-400" />
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 mt-3">Awaiting your review</p>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-none bg-white">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Approved</p>
                              {loading ? (
                                <Skeleton className="h-9 w-12 mt-1" />
                              ) : (
                                <p className="text-4xl font-bold text-emerald-600 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {approved.length}
                                </p>
                              )}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 mt-3">Successfully cleared</p>
                        </CardContent>
                      </Card>

                      <Card className="border-stone-200 shadow-none bg-white">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">Rejected</p>
                              {loading ? (
                                <Skeleton className="h-9 w-12 mt-1" />
                              ) : (
                                <p className="text-4xl font-bold text-red-500 mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {rejected.length}
                                </p>
                              )}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                              <XCircle className="w-5 h-5 text-red-400" />
                            </div>
                          </div>
                          <p className="text-xs text-stone-400 mt-3">Returned for action</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pending quick-action list */}
                    <Card className="border-stone-200 shadow-none bg-white">
                      <CardHeader className="pb-3 border-b border-stone-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-semibold text-stone-800">
                              Pending Requests
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                              Students waiting for hostel clearance
                            </CardDescription>
                          </div>
                          {pending.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setActiveTab("requests")}
                              className="text-xs gap-1.5"
                            >
                              View All
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {loading ? (
                          <div className="p-5 space-y-3">
                            {[1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-12 w-full" />
                            ))}
                          </div>
                        ) : pending.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-stone-400">
                            <ShieldCheck className="w-10 h-10 mb-3 text-emerald-300" />
                            <p className="text-sm font-medium">All caught up</p>
                            <p className="text-xs mt-1">No pending requests</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-stone-100">
                            {pending.slice(0, 5).map((step) => (
                              <div key={step.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-stone-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-stone-100 text-stone-600 text-xs font-bold">
                                      {step.clearance_request.profiles?.full_name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm font-medium text-stone-700">
                                    {step.clearance_request.profiles?.full_name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 px-3"
                                    onClick={() => handleApprove(step.id)}
                                    disabled={actionLoading === step.id}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 px-3"
                                    onClick={() => {
                                      setRejectDialog({ open: true, stepId: step.id });
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* ── REQUESTS TAB ── */}
                {activeTab === "requests" && (
                  <Card className="border-stone-200 shadow-none bg-white">
                    <CardHeader className="border-b border-stone-100 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
                            <Users className="w-4 h-4 text-stone-400" />
                            All Clearance Requests
                          </CardTitle>
                          <CardDescription className="text-xs mt-0.5">
                            {steps.length} total students assigned to hostel
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {loading ? (
                        <div className="p-6 space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-14 w-full" />
                          ))}
                        </div>
                      ) : steps.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                          <ClipboardList className="w-10 h-10 mb-3 text-stone-200" />
                          <p className="text-sm font-medium">No requests yet</p>
                          <p className="text-xs mt-1">Students assigned to this hostel will appear here</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent border-stone-100">
                              <TableHead className="text-xs font-semibold text-stone-400 uppercase tracking-wide pl-5">Student</TableHead>
                              <TableHead className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Status</TableHead>
                              <TableHead className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Remarks</TableHead>
                              <TableHead className="text-xs font-semibold text-stone-400 uppercase tracking-wide text-right pr-5">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {steps.map((step) => (
                              <TableRow key={step.id} className="border-stone-100 hover:bg-stone-50/60">
                                <TableCell className="pl-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-stone-100 text-stone-600 text-xs font-bold">
                                        {step.clearance_request.profiles?.full_name
                                          ?.split(" ")
                                          .map((n) => n[0])
                                          .join("")
                                          .slice(0, 2)
                                          .toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-stone-700">
                                      {step.clearance_request.profiles?.full_name}
                                    </span>
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      step.status === "approved"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]"
                                        : step.status === "rejected"
                                        ? "border-red-200 bg-red-50 text-red-700 text-[11px]"
                                        : "border-amber-200 bg-amber-50 text-amber-700 text-[11px]"
                                    }
                                  >
                                    {step.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                    {step.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                    {step.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-sm text-stone-400 max-w-[200px] truncate">
                                  {step.comment || (step.status === "approved" ? "Cleared" : "—")}
                                </TableCell>

                                <TableCell className="text-right pr-5">
                                  {step.status === "pending" ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        size="sm"
                                        className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 px-3"
                                        onClick={() => handleApprove(step.id)}
                                        disabled={actionLoading === step.id}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 px-3"
                                        onClick={() =>
                                          setRejectDialog({ open: true, stepId: step.id })
                                        }
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                          <MoreHorizontal className="w-4 h-4 text-stone-400" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="text-sm">
                                        <DropdownMenuItem
                                          onClick={() => handleApprove(step.id)}
                                          className="text-emerald-600 focus:text-emerald-700"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                          Mark Approved
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            setRejectDialog({ open: true, stepId: step.id })
                                          }
                                          className="text-red-600 focus:text-red-700"
                                        >
                                          <XCircle className="w-3.5 h-3.5 mr-2" />
                                          Mark Rejected
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </main>

          {/* ── REJECT DIALOG ── */}
          <Dialog
            open={rejectDialog.open}
            onOpenChange={(open) => {
              setRejectDialog({ open, stepId: null });
              setRejectComment("");
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-5 h-5" />
                  Reject Clearance Request
                </DialogTitle>
                <DialogDescription>
                  Provide a clear reason so the student knows what to address before reapplying.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <Textarea
                  placeholder="e.g. Outstanding hostel fees, Unreturned hostel key..."
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="min-h-[100px] resize-none text-sm"
                />
                <p className="text-xs text-stone-400 mt-1.5">
                  This message will be visible to the student on their dashboard.
                </p>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRejectDialog({ open: false, stepId: null });
                    setRejectComment("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRejectConfirm}
                  disabled={!!actionLoading || !rejectComment.trim()}
                >
                  Confirm Rejection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}