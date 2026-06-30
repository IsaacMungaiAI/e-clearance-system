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
      <main className="flex-1 bg-background overflow-auto">
        {children}
      </main>
    </div>
  );
}