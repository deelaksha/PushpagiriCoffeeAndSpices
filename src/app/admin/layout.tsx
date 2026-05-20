// Admin layout — overrides root layout to hide Navbar/Footer/WhatsApp
// The admin dashboard manages its own full-screen sidebar layout
import AdminGuard from '@/components/layout/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-inter">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block shrink-0">
          <AdminSidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
