import {
  ArrowUpRight,
  BellRing,
  Building2,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  DoorOpen,
  FileBarChart,
  ShieldAlert,
  TriangleAlert,
  Users,
} from "lucide-react";

import { DashboardShell } from "@/components/hostel-officer/dashboard-shell";
import { HostelSidebar } from "@/components/hostel-officer/hostel-sidebar";
import { HostelStats } from "@/components/hostel-officer/hostel-stats";
import { PageHeader } from "@/components/hostel-officer/page-header";
import { RoomCard } from "@/components/hostel-officer/room-card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getUserProfile } from "@/lib/getUserProfile";

const roomCards = [
  {
    roomNumber: "A-12",
    hostelName: "Riverside Hostel",
    occupant: "Brian Otieno",
    occupied: true,
    inspectionStatus: "passed" as const,
    maintenanceRequired: false,
    capacity: 2,
    occupants: 2,
  },
  {
    roomNumber: "B-04",
    hostelName: "Summit Hostel",
    occupant: "Vacant",
    occupied: false,
    inspectionStatus: "pending" as const,
    maintenanceRequired: true,
    capacity: 1,
    occupants: 0,
  },
  {
    roomNumber: "C-09",
    hostelName: "Oak Residence",
    occupant: "Mercy Wanjiku",
    occupied: true,
    inspectionStatus: "passed" as const,
    maintenanceRequired: false,
    capacity: 1,
    occupants: 1,
  },
];

const activityItems = [
  {
    title: "New clearance request received",
    description:
      "A third-year student from Computer Science submitted hostel clearance for review.",
    time: "12 min ago",
    icon: ClipboardList,
    accent: "emerald",
  },
  {
    title: "Room inspection scheduled",
    description:
      "Block B maintenance checks have been queued for this afternoon.",
    time: "45 min ago",
    icon: CalendarClock,
    accent: "amber",
  },
  {
    title: "Occupancy threshold exceeded",
    description:
      "North Wing is currently at 94% capacity and should be monitored closely.",
    time: "Today",
    icon: ShieldAlert,
    accent: "red",
  },
];

const priorityItems = [
  {
    label: "Pending clearance reviews",
    value: "18",
    tone: "amber",
  },
  {
    label: "Rooms requiring attention",
    value: "6",
    tone: "red",
  },
  {
    label: "Rooms currently in use",
    value: "87",
    tone: "emerald",
  },
];

export default async function HostelOfficerPage() {
  const session = await getUserProfile();

  const userName =
    session?.profile?.fullName?.trim() ||
    session?.user?.email?.split("@")[0] ||
    "Hostel Officer";

  const userEmail = session?.user?.email;

  return (
    <DashboardShell
      sidebar={<HostelSidebar />}
      title="Hostel Officer Dashboard"
      description="Monitor occupancy, room status, and resident clearance activity."
      userName={userName}
      userEmail={userEmail}
    >
      <div className="space-y-8">
        <Card className="overflow-hidden border-emerald-200/70 bg-gradient-to-br from-emerald-600 via-emerald-500 to-slate-900 text-white shadow-lg">
          <CardContent className="grid gap-8 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
            <div className="space-y-5">
              <Badge className="w-fit border-white/15 bg-white/15 text-white hover:bg-white/20">
                Live hostel operations
              </Badge>

              <div className="space-y-3">
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
                  Keep room assignments, inspections, and clearance requests under control from one place.
                </h2>
                <p className="max-w-2xl text-sm text-emerald-50/90 md:text-base">
                  Review occupancy, flag maintenance issues, and respond to student requests before they slow down the clearance process.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary">
                  Review Requests
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  Open Room Board
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-emerald-50/80">Today's inspections</p>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="mt-2 text-3xl font-semibold">14</p>
                <p className="mt-1 text-sm text-emerald-50/80">6 rooms still need follow-up</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-emerald-50/80">Notifications</p>
                  <BellRing className="h-4 w-4" />
                </div>
                <p className="mt-2 text-3xl font-semibold">9</p>
                <p className="mt-1 text-sm text-emerald-50/80">3 are marked urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <HostelStats pending={18} approved={126} rejected={4} occupiedRooms={87} />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Operational priorities</CardTitle>
              <CardDescription>
                The main items the hostel office should focus on today.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {priorityItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border bg-muted/25 p-4"
                >
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold tracking-tight">{item.value}</p>
                    <Badge
                      variant="outline"
                      className={
                        item.tone === "amber"
                          ? "border-amber-200 text-amber-700"
                          : item.tone === "red"
                            ? "border-red-200 text-red-700"
                            : "border-emerald-200 text-emerald-700"
                      }
                    >
                      {item.tone}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Common hostel office tasks and shortcuts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <ClipboardList className="h-4 w-4" />
                Review pending requests
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DoorOpen className="h-4 w-4" />
                Inspect vacant rooms
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileBarChart className="h-4 w-4" />
                Generate occupancy report
              </Button>
            </CardContent>
          </Card>
        </section>

        <section>
          <PageHeader
            title="Room overview"
            description="Spot occupancy and inspection issues at a glance."
            actions={
              <>
                <Button variant="outline">Export</Button>
                <Button>Open room map</Button>
              </>
            }
          />

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {roomCards.map((room) => (
              <RoomCard
                key={room.roomNumber}
                roomNumber={room.roomNumber}
                hostelName={room.hostelName}
                occupant={room.occupant}
                occupied={room.occupied}
                inspectionStatus={room.inspectionStatus}
                maintenanceRequired={room.maintenanceRequired}
                capacity={room.capacity}
                occupants={room.occupants}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Recent hostel activity</CardTitle>
              <CardDescription>
                Most recent events affecting residents and room management.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activityItems.map((item) => {
                const Icon = item.icon;

                const accentClasses =
                  item.accent === "amber"
                    ? "bg-amber-100 text-amber-700"
                    : item.accent === "red"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700";

                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border p-4"
                  >
                    <div className={`rounded-xl p-2 ${accentClasses}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium">{item.title}</p>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hostel summary</CardTitle>
              <CardDescription>
                A quick snapshot of the current hostel operation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Hostels monitored</p>
                    <p className="text-sm text-muted-foreground">4 active residential blocks</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Residents checked in</p>
                    <p className="text-sm text-muted-foreground">Current occupancy is stable</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                  87%
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                    <TriangleAlert className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Flagged maintenance items</p>
                    <p className="text-sm text-muted-foreground">Needs inspection this week</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-amber-200 text-amber-700">
                  6 open
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}
