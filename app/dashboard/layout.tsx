// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-4">
        <h2 className="font-semibold text-lg">Clearance System</h2>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-green-50 p-6">
        {children}
      </main>
    </div>
  );
}