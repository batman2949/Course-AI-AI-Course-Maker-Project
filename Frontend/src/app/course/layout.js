export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Page Content */}
        <div>{children}</div>
    </div>
  );
}
