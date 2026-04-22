import { createSupabaseAdmin } from '@/lib/supabase';
import ApplicationsView from './ApplicationsView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminApplicationsPage() {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  return <ApplicationsView applications={data || []} />;
}
