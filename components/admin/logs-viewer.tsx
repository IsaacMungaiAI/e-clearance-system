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
import { LogsTable } from './logs-table';
import { LogDetail } from './log-detail';

import type { LogEntry, GetLogsResult, LogFilters } from '@/app/actions/admin/get-logs';

interface Props {
  initialData: GetLogsResult;
}

export function LogsViewer({ initialData }: Props) {
  const [data, setData] = useState<GetLogsResult>(initialData);
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchLogs = useCallback(
    (overrides: Partial<LogFilters> = {}) => {
      startTransition(async () => {
        const filters: LogFilters = {
          page: overrides.page ?? page,
          search: (overrides.search ?? search) || undefined,
          action: (overrides.action ?? actionFilter) || undefined,
          dateFrom: (overrides.dateFrom ?? dateFrom) || undefined,
          dateTo: (overrides.dateTo ?? dateTo) || undefined,
          pageSize: 50,
        };

        const { getLogs } = await import('@/app/actions/admin/get-logs');
        const result = await getLogs(filters);
        setData(result);
      });
    },
    [page, search, actionFilter, dateFrom, dateTo]
  );

  const handleSearch = () => {
    setPage(1);
    fetchLogs({ page: 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRowClick = (log: LogEntry) => {
    setSelectedLog(log);
    setDetailOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchLogs({ page: newPage });
  };

  const handleActionFilterChange = (value: string | null) => {
    const v = value ?? '';
    setActionFilter(v);
    setPage(1);
    fetchLogs({ page: 1, action: v || undefined });
  };

  const handleDateChange = () => {
    setPage(1);
    fetchLogs({ page: 1 });
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Search actor, action, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <Select value={actionFilter} onValueChange={handleActionFilterChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {data.actions.map((action) => (
              <SelectItem key={action} value={action}>
                {action}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              handleDateChange();
            }}
            className="w-[150px]"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              handleDateChange();
            }}
            className="w-[150px]"
          />
        </div>

        <Button onClick={handleSearch} disabled={isPending}>
          {isPending ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {data.total} log{data.total !== 1 ? 's' : ''} found
        {data.totalPages > 1 && ` · Page ${data.page} of ${data.totalPages}`}
      </div>

      {isPending ? (
        <GlassLoading type="table" />
      ) : (
        <div className="overflow-x-auto">
          <LogsTable logs={data.logs} onRowClick={handleRowClick} />
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

      <LogDetail
        log={selectedLog}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
