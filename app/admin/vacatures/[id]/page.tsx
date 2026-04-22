import { notFound } from 'next/navigation';
import { createSupabaseAdmin } from '@/lib/supabase';
import VacancyForm from '@/components/VacancyForm';

export const dynamic = 'force-dynamic';

export default async function EditVacancyPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseAdmin();
  const { data: vacancy } = await supabase
    .from('vacancies')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!vacancy) notFound();

  return <VacancyForm vacancy={vacancy} />;
}
