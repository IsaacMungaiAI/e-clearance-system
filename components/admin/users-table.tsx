'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import type { UserEntry } from '@/app/actions/admin/get-users';

const roleColors: Record<string, string> = {
  student: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  officer_finance: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  officer_library: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  officer_hostel: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  registrar: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  admin: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const roleLabels: Record<string, string> = {
  student: 'Student',
  officer_finance: 'Finance Officer',
  officer_library: 'Library Officer',
  officer_hostel: 'Hostel Officer',
  registrar: 'Registrar',
  admin: 'Admin',
};

interface Props {
  users: UserEntry[];
  onRowClick: (user: UserEntry) => void;
}

export function UsersTable({ users, onRowClick }: Props) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No users found</p>
        <p className="text-sm mt-1">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[140px]">Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="w-[120px]">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onRowClick(user)}
            >
              <TableCell className="font-medium text-sm">
                {user.fullName ?? '—'}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={roleColors[user.role ?? ''] ?? ''}
                >
                  {roleLabels[user.role ?? ''] ?? user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.departmentName ?? '—'}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
