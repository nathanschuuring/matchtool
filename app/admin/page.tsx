import { createSupabaseAdmin } from '@/lib/supabase';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createSupabaseAdmin();
  const [vacanciesRes, applicationsRes] = await Promise.all([
    supabase.from('vacancies').select('*').order('created_at', { ascending: false }),
    supabase.from('applications').select('id, vacancy_id'),
  ]);

  return (
    <AdminDashboard
      vacancies={vacanciesRes.data || []}
      applications={applicationsRes.data || []}
      siteUrl={process.env.NEXT_PUBLIC_SITE_URL || ''}
    />
  );
}
