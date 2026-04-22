import Link from 'next/link';
import { createSupabasePublic } from '@/lib/supabase';
import { formatSalary } from '@/lib/utils';
import { PublicHeader, PublicFooter } from '@/components/PublicLayout';
import { MapPin, Clock, Euro, Briefcase, ChevronRight } from 'lucide-react';

export const revalidate = 60; // 60 seconds cache

export default async function HomePage() {
  const supabase = createSupabasePublic();
  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* Hero */}
      <section style={{ background: '#0F3A7A' }} className="text-white py-20 relative overflow-hidden">
        <div
          className="absolute pointer-events-none"
          style={{
            left: '5%',
            top: '30%',
            width: '620px',
            height: '210px',
            background:
              'linear-gradient(135deg, rgba(255,232,26,0.4) 0%, rgba(255,232,26,0.15) 60%, transparent 100%)',
            clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h1
            className="font-black mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              letterSpacing: '-0.02em',
              lineHeight: '1.05',
              maxWidth: '700px',
            }}
          >
            Vind jouw nieuwe baan
          </h1>
          <p className="text-lg opacity-90 max-w-xl">
            Ontdek onze openstaande vacatures en solliciteer direct.
          </p>
        </div>
      </section>

      {/* Vacature lijst */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-black mb-10"
            style={{ color: '#0F3A7A', letterSpacing: '-0.02em' }}
          >
            Alle vacatures
          </h2>

          {(!vacancies || vacancies.length === 0) ? (
            <div className="bg-gray-50 rounded p-16 text-center">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Er zijn op dit moment geen vacatures beschikbaar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {vacancies.map((v) => (
                <Link
                  key={v.id}
                  href={`/vacature/${v.slug}`}
                  className="bg-white rounded border border-gray-200 p-6 hover:shadow-xl transition group relative overflow-hidden"
                >
                  <h3
                    className="font-black text-lg mb-4 pr-10"
                    style={{ color: '#0F3A7A', letterSpacing: '-0.01em', minHeight: '3rem' }}
                  >
                    {v.title}
                  </h3>
                  <div className="space-y-1.5 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" style={{ color: '#0F3A7A' }} />
                      {v.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" style={{ color: '#0F3A7A' }} />
                      {v.hours} uur
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-3.5 h-3.5" style={{ color: '#0F3A7A' }} />€{' '}
                      {formatSalary(v.salary_min)} - € {formatSalary(v.salary_max)} per maand
                    </div>
                  </div>
                  <div
                    className="absolute bottom-5 right-5 w-10 h-10 rounded flex items-center justify-center transition"
                    style={{ background: '#FFE81A' }}
                  >
                    <ChevronRight className="w-5 h-5" style={{ color: '#0F3A7A' }} strokeWidth={2.5} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
