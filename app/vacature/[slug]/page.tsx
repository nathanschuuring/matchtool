import { notFound } from 'next/navigation';
import { createSupabasePublic } from '@/lib/supabase';
import { PublicHeader, PublicFooter } from '@/components/PublicLayout';
import VacancyView from './VacancyView';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createSupabasePublic();
  const { data } = await supabase
    .from('vacancies')
    .select('title, location')
    .eq('slug', params.slug)
    .single();

  if (!data) return { title: 'Vacature niet gevonden' };
  return {
    title: `${data.title} in ${data.location} | Actief Werkt!`,
    description: `Solliciteer nu op ${data.title} in ${data.location}`,
  };
}

export default async function VacancyPage({ params }: { params: { slug: string } }) {
  const supabase = createSupabasePublic();
  const { data: vacancy } = await supabase
    .from('vacancies')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (!vacancy) notFound();

  const { data: relatedVacancies } = await supabase
    .from('vacancies')
    .select('*')
    .eq('published', true)
    .neq('id', vacancy.id)
    .limit(6);

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <VacancyView vacancy={vacancy} relatedVacancies={relatedVacancies || []} />
      <PublicFooter />
    </div>
  );
}
