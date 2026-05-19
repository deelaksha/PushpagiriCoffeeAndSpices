// Admin layout — overrides root layout to hide Navbar/Footer/WhatsApp
// The admin dashboard manages its own full-screen sidebar layout
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen overflow-hidden">{children}</div>;
}
