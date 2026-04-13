'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { logout } from '@/app/actions/auth';

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
        <Sidebar>
          <SidebarContent className='bg-green-700 text-white'>
            <SidebarGroup>
              <SidebarGroupLabel className='text-white text-xl text-bold'>Registrar</SidebarGroupLabel>
              <SidebarGroupContent className='border-t border-green-600 mt-5'>
                <SidebarMenu >
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
                <p className="text-xs text-muted-foreground">admin@school.com</p>
              </div>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Logout
                </button>
              </form>
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
              <CardContent className="space-y-4">

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <Input placeholder="Search by name or email..." />

                  <Select>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="officer_finance">Finance Officer</SelectItem>
                      <SelectItem value="officer_library">Library Officer</SelectItem>
                      <SelectItem value="officer_hostel">Hostel Officer</SelectItem>
                      <SelectItem value="registrar">Registrar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="border rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">John Doe</td>
                        <td className="p-3">john@example.com</td>
                        <td className="p-3">Student</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                            Active
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Reset Password</Button>
                          <Button variant="destructive" size="sm">Disable</Button>
                        </td>
                      </tr>

                      <tr className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">Jane Smith</td>
                        <td className="p-3">jane@example.com</td>
                        <td className="p-3">Finance Officer</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
                            Pending
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Reset Password</Button>
                          <Button variant="destructive" size="sm">Disable</Button>
                        </td>
                      </tr>

                      <tr className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">Michael Lee</td>
                        <td className="p-3">michael@example.com</td>
                        <td className="p-3">Library Officer</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">
                            Disabled
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Reset Password</Button>
                          <Button variant="destructive" size="sm">Disable</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Showing 1–10 of 50 users</p>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>

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
