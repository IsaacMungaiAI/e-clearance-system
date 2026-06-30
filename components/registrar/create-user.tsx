'use client';

import { useState } from 'react';
import { createUserAction } from '@/app/actions/users/create-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<string>('student');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);


    try {
      const result = await createUserAction({
        email,
        full_name: fullName,
        password,
        role,
      });

      setMessage(result.message);

      if (result.success) {
        setEmail('');
        setFullName('');
        setPassword('');
        setRole('student');
      }
    } catch (err: any) {
      setMessage(`Request failed: ${err.message}`);
    }

    setLoading(false);
  };

  const handleRoleChange = (newRole: string | null) => {
    if (newRole) {
      setRole(newRole);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="officer_finance">Finance Officer</SelectItem>
                <SelectItem value="registrar">Registrar</SelectItem>
                <SelectItem value="officer_library">Library Officer</SelectItem>
                <SelectItem value="officer_hostel">Hostel Officer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </form>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes('Error') || message.includes('Request failed') ? 'text-destructive' : 'text-primary'}`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}