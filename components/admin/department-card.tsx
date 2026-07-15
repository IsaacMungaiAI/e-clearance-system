'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Users } from 'lucide-react';

import type { DepartmentEntry } from '@/app/actions/admin/get-departments';

interface Props {
  department: DepartmentEntry;
  onEdit: (dept: DepartmentEntry) => void;
}

export function DepartmentCard({ department, onEdit }: Props) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{department.name}</CardTitle>
          {department.code && (
            <p className="text-xs font-mono text-muted-foreground">
              {department.code}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              department.isActive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
            }
          >
            {department.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(department)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {department.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {department.description}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {department.userCount} user{department.userCount !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
