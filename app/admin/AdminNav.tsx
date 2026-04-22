'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, Users, Settings, LogOut } from 'lucide-react';
import { AwLogo } from '@/components/PublicLayout';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide navigation on login page
  if (pathname === '/admin/login') return null;

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <AwLogo />
          </Link>
          <span
            className="hidden md:inline-block text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: '#0F3A7A', color: '#FFE81A' }}
          >
            MATCHTOOL
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <NavLink href="/admin" active={isActive('/admin') && pathname === '/admin'} icon={Briefcase}>
            Vacatures
          </NavLink>
          <NavLink
            href="/admin/sollicitaties"
            active={isActive('/admin/sollicitaties')}
            icon={Users}
          >
            Sollicitaties
          </NavLink>
          <NavLink
            href="/admin/instellingen"
            active={isActive('/admin/instellingen')}
            icon={Settings}
          >
            Instellingen
          </NavLink>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded text-sm font-bold flex items-center gap-2 text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  icon: Icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="px-3.5 py-2 rounded text-sm font-bold flex items-center gap-2 transition"
      style={{
        background: active ? '#EFF4FB' : 'transparent',
        color: active ? '#0F3A7A' : '#6B7280',
      }}
    >
      <Icon className="w-4 h-4" /> {children}
    </Link>
  );
}
