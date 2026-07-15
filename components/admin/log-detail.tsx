'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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

function formatJSON(data: Record<string, unknown> | null) {
  if (!data) return null;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

interface Props {
  log: LogEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDetail({ log, open, onOpenChange }: Props) {
  if (!log) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={getActionColor(log.action)}
            >
              {log.action.toUpperCase()}
            </Badge>
            <span className="text-base font-normal text-muted-foreground">
              {log.type === 'activity' ? 'Activity' : 'Audit'}
            </span>
          </SheetTitle>
          <SheetDescription>
            {new Date(log.createdAt).toLocaleString()}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          <Section label="Actor">
            <p className="text-sm font-medium">{log.actorName ?? 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">ID: {log.actorId}</p>
          </Section>

          <Separator />

          <Section label="Action">
            <p className="text-sm">{log.action}</p>
          </Section>

          {log.description && (
            <>
              <Separator />
              <Section label="Description">
                <p className="text-sm text-muted-foreground">{log.description}</p>
              </Section>
            </>
          )}

          {log.entity && (
            <>
              <Separator />
              <Section label="Entity">
                <p className="text-sm">{log.entity}</p>
                {log.entityId && (
                  <p className="text-xs text-muted-foreground">ID: {log.entityId}</p>
                )}
              </Section>
            </>
          )}

          {log.oldData && (
            <>
              <Separator />
              <Section label="Previous Data">
                <ScrollArea className="h-40 w-full rounded-md border bg-muted/50 p-3">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {formatJSON(log.oldData)}
                  </pre>
                </ScrollArea>
              </Section>
            </>
          )}

          {log.newData && (
            <>
              <Separator />
              <Section label="New Data">
                <ScrollArea className="h-40 w-full rounded-md border bg-muted/50 p-3">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {formatJSON(log.newData)}
                  </pre>
                </ScrollArea>
              </Section>
            </>
          )}
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
