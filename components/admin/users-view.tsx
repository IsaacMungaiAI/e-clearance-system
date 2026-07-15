'use client';

import { useState, useCallback, useTransition } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GlassLoading } from '@/components/ui/glass-loading';
import { UsersTable } from './users-table';
import { UserDetailSheet } from './user-detail-sheet';

import type { UserEntry, UserFilters, GetUsersResult } from '@/app/actions/admin/get-users';

interface Props {
  initialData: GetUsersResult;
}

const ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'officer_finance', label: 'Finance Officer' },
  { value: 'officer_library', label: 'Library Officer' },
  { value: 'officer_hostel', label: 'Hostel Officer' },
  { value: 'registrar', label: 'Registrar' },
  { value: 'admin', label: 'Admin' },
];

export function UsersView({ initialData }: Props) {
  const [data, setData] = useState<GetUsersResult>(initialData);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<UserEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchUsers = useCallback(
    (overrides: Partial<UserFilters> = {}) => {
      startTransition(async () => {
        const filters: UserFilters = {
          page: overrides.page ?? page,
          search: (overrides.search ?? search) || undefined,
          role: (overrides.role ?? roleFilter) || undefined,
          departmentId: (overrides.departmentId ?? deptFilter) || undefined,
          pageSize: 25,
        };

        const { getUsers } = await import('@/app/actions/admin/get-users');
        const result = await getUsers(filters);
        setData(result);
      });
    },
    [page, search, roleFilter, deptFilter]
  );

  const handleSearch = () => {
    setPage(1);
    fetchUsers({ page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRowClick = (user: UserEntry) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers({ page: newPage });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <Select value={roleFilter} onValueChange={(v) => {
          const val = (v === 'all' || v === null) ? '' : v;
          setRoleFilter(val);
          setPage(1);
          fetchUsers({ page: 1, role: val || undefined });
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLE_OPTIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={deptFilter} onValueChange={(v) => {
          const val = (v === 'all' || v === null) ? '' : v;
          setDeptFilter(val);
          setPage(1);
          fetchUsers({ page: 1, departmentId: val || undefined });
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {data.departments.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {data.total} user{data.total !== 1 ? 's' : ''} found
        {data.totalPages > 1 && ` · Page ${data.page} of ${data.totalPages}`}
      </div>

      {isPending ? (
        <GlassLoading type="table" />
      ) : (
        <div className="overflow-x-auto">
          <UsersTable users={data.users} onRowClick={handleRowClick} />
        </div>
      )}

      {data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isPending}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {data.page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages || isPending}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <UserDetailSheet
        user={selectedUser}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        departments={data.departments}
        onUpdated={() => fetchUsers({})}
      />
    </div>
  );
}
