import Link from 'next/link';
import AdminNav from './AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
