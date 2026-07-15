'use client';

import { useState, useCallback, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GlassLoading } from '@/components/ui/glass-loading';
import { DepartmentCard } from './department-card';
import { DepartmentDialog } from './department-dialog';

import type { DepartmentEntry } from '@/app/actions/admin/get-departments';
import { getDepartments } from '@/app/actions/admin/get-departments';

interface Props {
  initialData: DepartmentEntry[];
}

export function DepartmentsView({ initialData }: Props) {
  const [departments, setDepartments] = useState<DepartmentEntry[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentEntry | null>(null);

  const refresh = useCallback(() => {
    startTransition(async () => {
      const result = await getDepartments();
      setDepartments(result);
    });
  }, []);

  const handleCreate = () => {
    setEditingDept(null);
    setDialogOpen(true);
  };

  const handleEdit = (dept: DepartmentEntry) => {
    setEditingDept(dept);
    setDialogOpen(true);
  };

  const handleSaved = () => {
    setDialogOpen(false);
    setEditingDept(null);
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {departments.length} department{departments.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={handleCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Department
        </Button>
      </div>

      {isPending ? (
        <GlassLoading type="card" count={3} />
      ) : departments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No departments yet</p>
          <p className="text-sm mt-1">Create your first department to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        department={editingDept}
        onSaved={handleSaved}
      />
    </div>
  );
}
