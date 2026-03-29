'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// shadcn sidebar imports
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function RegistrarDashboard() {
  type Role = 'student' | 'officer_library' | 'officer_finance' | 'officer_hostel' | 'registrar';

  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'clearance'>('create');

  const [form, setForm] = useState<{
    email: string;
    full_name: string;
    password: string;
    role: Role;
  }>({
    email: '',
    full_name: '',
    password: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('User created successfully');
        setForm({ email: '', full_name: '', password: '', role: 'student' });
      }
    } catch (err: any) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">

        {/* ✅ SHADCN SIDEBAR */}
        <Sidebar >
          <SidebarContent className='bg-green-700 text-white'>
            <SidebarGroup>
              <SidebarGroupLabel className='text-white text-xl font-bold'>Registrar</SidebarGroupLabel>
              <SidebarGroupContent className='mt-5 border-green-600 border-t'>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab('create')}>
                      Create User
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab('manage')}>
                      Manage Users
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab('clearance')}>
                      Clearance
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* ✅ Profile at bottom */}
          <SidebarFooter className='bg-green-700 border-t border-green-600'>
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">Registrar</p>
                <p className="text-xs text-muted-foreground text-white">admin@school.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-gray-50">

          {activeTab === 'create' && (
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value) => {
                        if (!value) return;
                        setForm({ ...form, role: value as Role });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="officer_finance">Finance Officer</SelectItem>
                        <SelectItem value="officer_library">Library Officer</SelectItem>
                        <SelectItem value="officer_hostel">Hostel Officer</SelectItem>
                        <SelectItem value="registrar">Registrar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                  </Button>
                </form>

                {message && (
                  <p className="mt-4 text-sm text-muted-foreground">{message}</p>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'manage' && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming next: table with search, filters, and actions.
                </p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'clearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Clearance Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming next: department approvals, status tracking, and certificates.
                </p>
              </CardContent>
            </Card>
          )}

        </main>
      </div>
    </SidebarProvider>
  );
}
