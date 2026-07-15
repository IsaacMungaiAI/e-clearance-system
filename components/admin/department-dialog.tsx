'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import type { DepartmentEntry } from '@/app/actions/admin/get-departments';
import { createDepartmentAction } from '@/app/actions/admin/create-department';
import { updateDepartmentAction } from '@/app/actions/admin/update-department';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: DepartmentEntry | null;
  onSaved: () => void;
}

export function DepartmentDialog({
  open,
  onOpenChange,
  department,
  onSaved,
}: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isPending, startTransition] = useTransition();

  const isEditing = !!department;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && department) {
      setName(department.name);
      setCode(department.code ?? '');
      setDescription(department.description ?? '');
      setIsActive(department.isActive ?? true);
    } else if (isOpen) {
      setName('');
      setCode('');
      setDescription('');
      setIsActive(true);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      let result;

      if (isEditing && department) {
        result = await updateDepartmentAction({
          departmentId: department.id,
          name,
          code,
          description: description || undefined,
          isActive,
        });
      } else {
        result = await createDepartmentAction({
          name,
          code,
          description: description || undefined,
        });
      }

      if (result.success) {
        toast.success(result.message);
        onSaved();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Department' : 'New Department'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update department details below.'
              : 'Fill in the details to create a new department.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Name</Label>
            <Input
              id="dept-name"
              placeholder="e.g. Computer Science"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-code">Code</Label>
            <Input
              id="dept-code"
              placeholder="e.g. CS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dept-desc">Description</Label>
            <Textarea
              id="dept-desc"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsActive(true)}
              >
                Active
              </Button>
              <Button
                variant={!isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsActive(false)}
              >
                Inactive
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !name || !code}
          >
            {isPending
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Create Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
