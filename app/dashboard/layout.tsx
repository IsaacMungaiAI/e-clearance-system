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
      <main className="flex-1 bg-green-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}