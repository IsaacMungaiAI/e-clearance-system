// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
     

      {/* Main */}
      <main className="flex-1 bg-green-50 p-6">
        {children}
      </main>
    </div>
  );
}