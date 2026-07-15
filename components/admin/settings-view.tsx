'use client';

import { useState, useTransition } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import type { SettingsData } from '@/app/actions/admin/get-settings';
import { updateSettingsAction } from '@/app/actions/admin/update-settings';

interface Props {
  initialData: SettingsData;
}

export function SettingsView({ initialData }: Props) {
  const [settings, setSettings] = useState<SettingsData>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: keyof SettingsData, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateSettingsAction(settings);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Academic Configuration</CardTitle>
          <CardDescription>
            Configure academic period and clearance settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academicPeriod">Academic Period</Label>
            <Input
              id="academicPeriod"
              placeholder="e.g. 2025/2026"
              value={settings.academicPeriod}
              onChange={(e) => handleChange('academicPeriod', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The current academic session displayed across the system.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clearanceDeadline">Clearance Deadline</Label>
            <Input
              id="clearanceDeadline"
              type="date"
              value={settings.clearanceDeadline}
              onChange={(e) => handleChange('clearanceDeadline', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Students cannot apply for clearance after this date.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxRetries">Max Clearance Retries</Label>
            <Input
              id="maxRetries"
              type="number"
              min={1}
              max={10}
              value={settings.maxClearanceRetries}
              onChange={(e) => handleChange('maxClearanceRetries', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              How many times a student can re-apply after rejection.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Control system-wide notification behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Send email and in-app notifications for clearance events.
              </p>
            </div>
            <Button
              variant={settings.notificationsEnabled === 'true' ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                handleChange(
                  'notificationsEnabled',
                  settings.notificationsEnabled === 'true' ? 'false' : 'true'
                )
              }
            >
              {settings.notificationsEnabled === 'true' ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
