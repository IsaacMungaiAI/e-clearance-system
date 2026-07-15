'use client';

import { useState, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import type { UserEntry } from '@/app/actions/admin/get-users';
import { updateUserAction } from '@/app/actions/admin/update-user';

const roleLabels: Record<string, string> = {
  student: 'Student',
  officer_finance: 'Finance Officer',
  officer_library: 'Library Officer',
  officer_hostel: 'Hostel Officer',
  registrar: 'Registrar',
  admin: 'Admin',
};

const roleColors: Record<string, string> = {
  student: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  officer_finance: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  officer_library: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  officer_hostel: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  registrar: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  admin: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'officer_finance', label: 'Finance Officer' },
  { value: 'officer_library', label: 'Library Officer' },
  { value: 'officer_hostel', label: 'Hostel Officer' },
  { value: 'registrar', label: 'Registrar' },
  { value: 'admin', label: 'Admin' },
];

interface Props {
  user: UserEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: { id: string; name: string }[];
  onUpdated: () => void;
}

export function UserDetailSheet({
  user,
  open,
  onOpenChange,
  departments,
  onUpdated,
}: Props) {
  const [role, setRole] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && user) {
      setRole(user.role ?? '');
      setDepartmentId(user.departmentId ?? '');
    }
    onOpenChange(isOpen);
  };

  const handleSave = () => {
    if (!user) return;

    startTransition(async () => {
      const result = await updateUserAction({
        userId: user.id,
        role: role || undefined,
        departmentId: departmentId || null,
      });

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        onUpdated();
      } else {
        toast.error(result.message);
      }
    });
  };

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={roleColors[user.role ?? ''] ?? ''}
            >
              {roleLabels[user.role ?? ''] ?? user.role}
            </Badge>
          </SheetTitle>
          <SheetDescription>Edit user details and role assignment</SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          <Section label="Name">
            <p className="text-sm font-medium">{user.fullName ?? '—'}</p>
          </Section>

          <Section label="User ID">
            <p className="text-xs font-mono text-muted-foreground">{user.id}</p>
          </Section>

          <Section label="Department">
            <p className="text-sm">{user.departmentName ?? '—'}</p>
          </Section>

          <Section label="Created">
            <p className="text-sm text-muted-foreground">
              {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}
            </p>
          </Section>

          <Separator />

          <Section label="Change Role">
            <Select value={role} onValueChange={(v) => setRole(v ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>

          <Section label="Assign Department">
            <Select value={departmentId} onValueChange={(v) => setDepartmentId(v ?? '')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Section>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </h4>
      {children}
    </div>
  );
}
