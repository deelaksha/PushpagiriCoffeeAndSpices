// Admin layout — overrides root layout to hide Navbar/Footer/WhatsApp
// The admin dashboard manages its own full-screen sidebar layout
import AdminGuard from '@/components/layout/AdminGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="h-screen overflow-hidden">{children}</div>
    </AdminGuard>
  );
}
