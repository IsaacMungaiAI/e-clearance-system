'use client';

import { useState } from 'react';

export default function CreateUserForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: fullName, role, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`User created successfully! ID: ${data.data.id}`);
        // reset form
        setEmail('');
        setFullName('');
        setRole('student');
        setPassword('');
      }
    } catch (err: any) {
      setMessage(`Request failed: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="student">Student</option>
            <option value="officer_finance">Finance Officer</option>
            <option value="registrar">Registrar</option>
            <option value="officer_library">Library Officer</option>
            <option value="officer_hostel">Hostel Officer</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}