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
import type { LogEntry } from '@/app/actions/admin/get-logs';

const actionColors: Record<string, string> = {
  create: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  update: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  delete: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  login: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  logout: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
};

function getActionColor(action: string): string {
  const key = Object.keys(actionColors).find((k) =>
    action.toLowerCase().includes(k)
  );
  return key ? actionColors[key] : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
}

const typeColors: Record<string, string> = {
  activity: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
  audit: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
};

interface Props {
  logs: LogEntry[];
  onRowClick: (log: LogEntry) => void;
}

export function LogsTable({ logs, onRowClick }: Props) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No logs found</p>
        <p className="text-sm mt-1">Try adjusting your filters or date range.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Timestamp</TableHead>
            <TableHead className="w-[140px]">Type</TableHead>
            <TableHead className="w-[160px]">Actor</TableHead>
            <TableHead className="w-[120px]">Action</TableHead>
            <TableHead>Description / Entity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onRowClick(log)}
            >
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={typeColors[log.type]}>
                  {log.type}
                </Badge>
              </TableCell>
              <TableCell className="text-sm font-medium">
                {log.actorName ?? '—'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getActionColor(log.action)}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {log.description ?? log.entity ?? '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
