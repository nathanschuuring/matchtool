'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, Euro, Briefcase, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  Plus, Check, CheckCircle, Mail, Phone, User,
} from 'lucide-react';
import type { Vacancy } from '@/lib/types';
import { formatSalary } from '@/lib/utils';

export default function VacancyView({
  vacancy,
  relatedVacancies,
}: {
  vacancy: Vacancy;
  relatedVacancies: Vacancy[];
}) {
  const [showMore, setShowMore] = useState(false);
  const [openEmployer, setOpenEmployer] = useState(false);
  const [openReq, setOpenReq] = useState(false);
  const [processIdx, setProcessIdx] = useState(0);
  const [relatedIdx, setRelatedIdx] = useState(0);

  const scrollToForm = () => {
    document.getElementById('sollicitatieformulier')?.scrollIntoView({ behavior: 'smooth' });
  };

  const descText = vacancy.description || '';
  const descLead = descText.length > 220 ? descText.slice(0, 220).trim() + '...' : descText;
  const hasMore = descText.length > 220 || (vacancy.responsibilities && vacancy.responsibilities.length > 0);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  return (
    <>
      {/* ══ HERO ══ */}
      <section style={{ background: '#0F3A7A', color: 'white' }} className="relative overflow-hidden">
        <div className="relative">
          <div
            className="absolute pointer-events-none"
            style={{
              left: '5%',
              top: '10px',
              width: '620px',
              height: '210px',
              background:
                'linear-gradient(135deg, rgba(255,232,26,0.4) 0%, rgba(255,232,26,0.15) 60%, transparent 100%)',
              clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
              zIndex: 0,
            }}
          />

          <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 relative z-10">
            <div className="text-sm font-medium mb-3" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {vacancy.contract_type}
            </div>
            <h1
              className="font-black mb-8"
              style={{
                color: 'white',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: '1.05',
                maxWidth: '600px',
              }}
            >
              {vacancy.title}
            </h1>

            <div className="flex items-end justify-between flex-wrap gap-4">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <MetaItem icon={MapPin}>{vacancy.location}</MetaItem>
                <MetaItem icon={Clock}>{vacancy.hours} uur</MetaItem>
                <MetaItem icon={Euro}>
                  € {formatSalary(vacancy.salary_min)} - € {formatSalary(vacancy.salary_max)} per maand
                </MetaItem>
                {vacancy.category && <MetaItem icon={Briefcase}>{vacancy.category}</MetaItem>}
              </div>
              <button onClick={scrollToForm} className="aw-btn-yellow">
                Solliciteren
              </button>
            </div>

            <div
              className="flex items-center justify-between mt-8 pt-4 text-sm"
              style={{ color: 'rgba(255,255,255,0.85)', borderTop: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span>{dateStr}</span>
              <span>#{vacancy.reference_number}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          {vacancy.description && (
            <ContentRow title="Omschrijving">
              <div className="text-base leading-relaxed text-gray-800">
                {showMore ? (
                  <>
                    <div className="whitespace-pre-wrap">{descText}</div>
                    {vacancy.responsibilities?.length > 0 && (
                      <ul className="mt-5 space-y-2.5">
                        {vacancy.responsibilities.map((r, i) => (
                          <CheckItem key={i}>{r}</CheckItem>
                        ))}
                      </ul>
                    )}
                    {hasMore && (
                      <button
                        onClick={() => setShowMore(false)}
                        className="mt-5 flex items-center gap-1.5 text-sm font-bold hover:underline"
                        style={{ color: '#0F3A7A' }}
                      >
                        <ChevronUp className="w-4 h-4" /> Lees minder
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap">{descLead}</div>
                    {hasMore && (
                      <button
                        onClick={() => setShowMore(true)}
                        className="mt-4 flex items-center gap-1.5 text-sm font-bold hover:underline"
                        style={{ color: '#0F3A7A' }}
                      >
                        <Plus className="w-4 h-4" /> Lees meer
                      </button>
                    )}
                  </>
                )}
              </div>
            </ContentRow>
          )}

          {vacancy.offer?.length > 0 && (
            <ContentRow
              title={
                <>
                  Wat wij
                  <br />
                  jou bieden
                </>
              }
            >
              <ul className="space-y-2">
                {vacancy.offer.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 px-4 py-3 rounded"
                    style={{ background: '#FBF2EC' }}
                  >
                    <Check
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: '#0F3A7A' }}
                      strokeWidth={3}
                    />
                    <span className="text-[15px] text-gray-800">{r}</span>
                  </li>
                ))}
              </ul>
            </ContentRow>
          )}

          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 mt-4">
            <div />
            <div>
              {vacancy.about_employer && (
                <Accordion
                  title="Over de opdrachtgever"
                  open={openEmployer}
                  onToggle={() => setOpenEmployer(!openEmployer)}
                >
                  <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                    {vacancy.about_employer}
                  </div>
                </Accordion>
              )}
              {(vacancy.requirements_intro || vacancy.requirements?.length > 0) && (
                <Accordion
                  title="Wat wij van je vragen"
                  open={openReq}
                  onToggle={() => setOpenReq(!openReq)}
                >
                  {vacancy.requirements_intro && (
                    <p className="text-base leading-relaxed mb-3 whitespace-pre-wrap text-gray-800">
                      {vacancy.requirements_intro}
                    </p>
                  )}
                  {vacancy.requirements?.length > 0 && (
                    <ul className="space-y-2.5">
                      {vacancy.requirements.map((r, i) => (
                        <CheckItem key={i}>{r}</CheckItem>
                      ))}
                    </ul>
                  )}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ APPLY SECTION ══ */}
      <section id="sollicitatieformulier" style={{ background: '#EFF4FB' }} className="py-16">
        <ApplySection vacancy={vacancy} />
      </section>

      {/* ══ SOLLICITATIEPROCES ══ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <h2
                className="text-2xl font-black mb-2"
                style={{ color: '#0F3A7A', letterSpacing: '-0.02em' }}
              >
                Het sollicitatieproces
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Nieuwsgierig naar wat je kunt verwachten? We leggen het je graag uit.
              </p>
            </div>
            <div>
              <ProcessCarousel idx={processIdx} setIdx={setProcessIdx} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <ContactBlock />

      {/* ══ RELATED ══ */}
      {relatedVacancies.length > 0 && (
        <section className="py-16" style={{ background: '#0F3A7A' }}>
          <div className="max-w-7xl mx-auto px-6">
            <h2
              className="text-2xl md:text-3xl font-black mb-8 text-white"
              style={{ letterSpacing: '-0.02em' }}
            >
              Dit vind je misschien ook interessant
            </h2>
            <RelatedCarousel vacancies={relatedVacancies} idx={relatedIdx} setIdx={setRelatedIdx} />
          </div>
        </section>
      )}
    </>
  );
}

function MetaItem({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5" />
      <span>{children}</span>
    </span>
  );
}

function ContentRow({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 mb-12">
      <div className="mb-4 lg:mb-0">
        <h2
          className="text-2xl md:text-3xl font-black"
          style={{ color: '#0F3A7A', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </div>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#0F3A7A' }} strokeWidth={3} />
      <span className="text-base leading-relaxed text-gray-800">{children}</span>
    </li>
  );
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left hover:opacity-80 transition"
      >
        <span
          className="text-lg md:text-xl font-black"
          style={{ color: '#0F3A7A', letterSpacing: '-0.01em' }}
        >
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5" style={{ color: '#0F3A7A' }} />
        ) : (
          <ChevronDown className="w-5 h-5" style={{ color: '#0F3A7A' }} />
        )}
      </button>
      {open && <div className="pb-6">{children}</div>}
    </div>
  );
}

function ContactBlock() {
  // Contactgegevens worden uit environment variables gelezen.
  // In Vercel kun je deze instellen onder Settings → Environment Variables:
  //   NEXT_PUBLIC_CONTACT_NAME, NEXT_PUBLIC_CONTACT_PHOTO,
  //   NEXT_PUBLIC_CONTACT_EMAIL, NEXT_PUBLIC_CONTACT_PHONE,
  //   NEXT_PUBLIC_CONTACT_WHATSAPP
  const name = process.env.NEXT_PUBLIC_CONTACT_NAME || 'Joyce';
  const photo = process.env.NEXT_PUBLIC_CONTACT_PHOTO || '';
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@example.com';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE || '+31 88 004 5250';
  const whatsapp = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '';

  // Maak schoon nummer voor tel: en wa.me links
  const telLink = `tel:${phone.replace(/\s/g, '')}`;
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
    : '';

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="rounded overflow-hidden flex flex-col md:flex-row"
          style={{ background: '#EFF4FB' }}
        >
          {/* Foto links - vol bloc met blauwe tint overlay */}
          <div
            className="flex-shrink-0 w-full md:w-72 relative"
            style={{ minHeight: '220px', background: '#0F3A7A' }}
          >
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover"
                style={{
                  position: 'absolute',
                  inset: 0,
                  mixBlendMode: 'luminosity',
                  opacity: 0.85,
                }}
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0F3A7A, #0B2E62)' }}
              >
                <User className="w-20 h-20" style={{ color: 'rgba(255,255,255,0.3)' }} />
              </div>
            )}
            {/* Blauwe overlay voor de duotone-look */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'rgba(15, 58, 122, 0.55)', mixBlendMode: 'multiply' }}
            />
          </div>

          {/* Tekst en knoppen rechts */}
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
            <h3
              className="text-2xl md:text-3xl font-black mb-3"
              style={{ color: '#0F3A7A', letterSpacing: '-0.02em' }}
            >
              Heb je een vraag?
            </h3>
            <p className="text-sm md:text-base text-gray-800 mb-5">
              {name} helpt je graag verder.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="px-6 py-3 font-bold text-sm rounded flex items-center gap-2 border bg-white hover:bg-gray-50 transition"
                style={{ color: '#0F3A7A', borderColor: '#E5E7EB' }}
              >
                <Mail className="w-4 h-4" /> E-mail
              </a>
              <a
                href={telLink}
                className="px-6 py-3 font-bold text-sm rounded flex items-center gap-2 border bg-white hover:bg-gray-50 transition"
                style={{ color: '#0F3A7A', borderColor: '#E5E7EB' }}
              >
                <Phone className="w-4 h-4" /> {phone}
              </a>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 font-bold text-sm rounded flex items-center gap-2 text-white hover:opacity-90 transition"
                  style={{ background: '#25D366' }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Stuur een WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessCarousel({ idx, setIdx }: { idx: number; setIdx: (n: number) => void }) {
  const steps = [
    {
      title: 'Je solliciteert',
      text:
        'Na jouw sollicitatie zal jouw contactpersoon je binnen 1 werkdag bellen om je beter te leren kennen.',
    },
    {
      title: 'Kennismaking',
      text: 'We nodigen je uit op een van onze vestigingen om verder kennis te maken.',
    },
    {
      title: 'Vervolgafspraak',
      text: 'Bezoek de opdrachtgever om te kijken of het aansluit bij jouw wensen en behoeften.',
    },
    {
      title: 'Een match!',
      text: 'Is er van beide kanten een klik, dan bespreken we graag het contract met je door.',
    },
  ];
  const visible = 3;
  const maxIdx = Math.max(0, steps.length - visible);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {steps.slice(idx, idx + visible).map((s, i) => {
          const stepNum = idx + i + 1;
          return (
            <div
              key={stepNum}
              className="rounded p-5 md:p-6"
              style={{ background: '#FBF2EC', border: '1px solid rgba(0,0,0,0.04)' }}
            >
              <div
                className="inline-flex items-center justify-center w-8 h-8 rounded mb-4"
                style={{ background: '#EFF4FB', color: '#0F3A7A', fontWeight: 900, fontSize: '0.95rem' }}
              >
                {stepNum}
              </div>
              <h4 className="font-black text-lg mb-2" style={{ color: '#0F3A7A', letterSpacing: '-0.01em' }}>
                {s.title}
              </h4>
              <p className="text-sm leading-relaxed text-gray-800">{s.text}</p>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: '#FFE81A', color: '#0F3A7A', opacity: idx === 0 ? 0.5 : 1 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIdx(Math.min(maxIdx, idx + 1))}
            disabled={idx === maxIdx}
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: '#FFE81A', color: '#0F3A7A', opacity: idx === maxIdx ? 0.5 : 1 }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 w-8 rounded-full"
              style={{ background: i === idx ? '#0F3A7A' : '#E5E7EB' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedCarousel({
  vacancies,
  idx,
  setIdx,
}: {
  vacancies: Vacancy[];
  idx: number;
  setIdx: (n: number) => void;
}) {
  const visible = 3;
  const maxIdx = Math.max(0, vacancies.length - visible);
  const slice = vacancies.slice(idx, idx + visible);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {slice.map((v) => (
          <Link
            key={v.id}
            href={`/vacature/${v.slug}`}
            className="bg-white rounded p-5 cursor-pointer hover:shadow-xl transition group relative overflow-hidden"
          >
            <h4
              className="font-black text-lg mb-3 pr-10"
              style={{ color: '#0F3A7A', letterSpacing: '-0.01em', minHeight: '3rem' }}
            >
              {v.title}
            </h4>
            <div className="space-y-1.5 text-sm text-gray-800">
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
              className="absolute bottom-4 right-4 w-9 h-9 rounded flex items-center justify-center"
              style={{ background: '#FFE81A' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#0F3A7A' }} strokeWidth={2.5} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: '#FFE81A', color: '#0F3A7A', opacity: idx === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIdx(Math.min(maxIdx, idx + 1))}
            disabled={idx === maxIdx}
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: '#FFE81A', color: '#0F3A7A', opacity: idx === maxIdx ? 0.4 : 1 }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// APPLY SECTION
// ═══════════════════════════════════════════════════════════════════

function ApplySection({ vacancy }: { vacancy: Vacancy }) {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    country: 'Nederland',
    postalCode: '',
    houseNumber: '',
    addition: '',
    day: '',
    month: '',
    year: '',
    email: '',
    phone: '',
    motivation: '',
    consent: false,
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });
  const canSubmit = form.firstName && form.lastName && form.email && form.phone && form.consent && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    try {
      // Upload CV first if present
      let cvUrl = '';
      let cvFilename = '';
      if (cvFile) {
        const formData = new FormData();
        formData.append('file', cvFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('CV upload mislukt');
        const uploadData = await uploadRes.json();
        cvUrl = uploadData.url;
        cvFilename = cvFile.name;
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vacancy_id: vacancy.id,
          vacancy_title: vacancy.title,
          vacancy_reference: vacancy.reference_number,
          vacancy_location: vacancy.location,
          first_name: form.firstName,
          middle_name: form.middleName,
          last_name: form.lastName,
          country: form.country,
          postal_code: form.postalCode,
          house_number: form.houseNumber + (form.addition ? `-${form.addition}` : ''),
          date_of_birth:
            form.day && form.month && form.year ? `${form.day}-${form.month}-${form.year}` : '',
          email: form.email,
          phone: form.phone,
          motivation: form.motivation,
          cv_url: cvUrl,
          cv_filename: cvFilename,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Sollicitatie verzenden mislukt');
      }

      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16">
          <div>
            <h2
              className="text-2xl md:text-3xl font-black"
              style={{ color: '#0F3A7A', letterSpacing: '-0.02em' }}
            >
              Solliciteren
            </h2>
          </div>
          <div className="bg-white rounded p-8 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: '#EFF4FB' }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: '#0F3A7A' }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: '#0F3A7A' }}>
              Bedankt!
            </h3>
            <p className="text-base text-gray-800">
              We hebben je sollicitatie ontvangen. Je contactpersoon belt je binnen 1 werkdag.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-16">
        <div className="mb-6 lg:mb-0">
          <h2
            className="text-2xl md:text-3xl font-black"
            style={{ color: '#0F3A7A', letterSpacing: '-0.02em' }}
          >
            Solliciteren
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FloatLabel label="Voornaam" value={form.firstName}>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                className="aw-input"
              />
            </FloatLabel>
            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-2">
                <FloatLabel label="Tussenvoegsel" value={form.middleName}>
                  <input
                    type="text"
                    value={form.middleName}
                    onChange={(e) => update('middleName', e.target.value)}
                    className="aw-input"
                  />
                </FloatLabel>
              </div>
              <div className="col-span-3">
                <FloatLabel label="Achternaam" value={form.lastName}>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    className="aw-input"
                  />
                </FloatLabel>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-black text-base mb-3" style={{ color: '#0F3A7A' }}>
              Adresgegevens
            </h4>
            <FloatLabel label="Land" value={form.country}>
              <select
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                className="aw-input"
              >
                <option>Nederland</option>
                <option>Polen</option>
                <option>Duitsland</option>
                <option>België</option>
                <option>Roemenië</option>
                <option>Anders</option>
              </select>
            </FloatLabel>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <FloatLabel label="Postcode" value={form.postalCode}>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={(e) => update('postalCode', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
              <FloatLabel label="Huisnr." value={form.houseNumber}>
                <input
                  type="text"
                  value={form.houseNumber}
                  onChange={(e) => update('houseNumber', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
              <FloatLabel label="Toevoeging" value={form.addition}>
                <input
                  type="text"
                  value={form.addition}
                  onChange={(e) => update('addition', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
            </div>
          </div>

          <div>
            <h4 className="font-black text-base mb-3" style={{ color: '#0F3A7A' }}>
              Geboortedatum
            </h4>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <FloatLabel label="DD" value={form.day}>
                <input
                  type="text"
                  maxLength={2}
                  value={form.day}
                  onChange={(e) => update('day', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
              <FloatLabel label="MM" value={form.month}>
                <input
                  type="text"
                  maxLength={2}
                  value={form.month}
                  onChange={(e) => update('month', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
              <FloatLabel label="JJJJ" value={form.year}>
                <input
                  type="text"
                  maxLength={4}
                  value={form.year}
                  onChange={(e) => update('year', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
            </div>
          </div>

          <div>
            <h4 className="font-black text-base mb-3" style={{ color: '#0F3A7A' }}>
              Contactgegevens
            </h4>
            <div className="space-y-3">
              <FloatLabel label="E-mail" value={form.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
              <FloatLabel label="Telefoon" value={form.phone}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className="aw-input"
                />
              </FloatLabel>
            </div>
          </div>

          <div>
            <h4 className="font-black text-base mb-3" style={{ color: '#0F3A7A' }}>
              Motivatie en cv
            </h4>
            <FloatLabel label="Waarom past deze baan bij jou? (niet verplicht)" value={form.motivation}>
              <textarea
                rows={3}
                value={form.motivation}
                onChange={(e) => update('motivation', e.target.value)}
                className="aw-input"
              />
            </FloatLabel>
            <div className="mt-3 border-2 border-dashed rounded p-5 text-center bg-white border-gray-200">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer inline-block">
                <div className="text-sm font-bold" style={{ color: '#0F3A7A' }}>
                  {cvFile ? cvFile.name : 'Upload jouw cv'}
                </div>
                <div className="text-xs mt-0.5 text-gray-500">PDF of Word-document (max. 5 MB)</div>
              </label>
            </div>
          </div>

          <label className="flex gap-3 cursor-pointer p-4 rounded bg-white">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update('consent', e.target.checked)}
              className="mt-0.5 w-4 h-4 flex-shrink-0"
              style={{ accentColor: '#0F3A7A' }}
            />
            <span className="text-xs leading-relaxed text-gray-800">
              Ik geef Actief Werkt! toestemming om mijn persoonsgegevens te verwerken voor bemiddeling naar
              werk en mij hiervoor te benaderen via WhatsApp. Toestemming voor WhatsApp kan ik intrekken
              bij mijn vestiging. Ik accepteer het{' '}
              <span style={{ color: '#0F3A7A', textDecoration: 'underline' }}>privacy statement</span>.
            </span>
          </label>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="aw-btn-yellow w-full"
            style={{ padding: '1rem' }}
          >
            {submitting ? 'Bezig met verzenden...' : 'Solliciteren'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FloatLabel({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  const hasValue = value && String(value).length > 0;
  return (
    <div className="relative">
      {children}
      <span
        className="absolute pointer-events-none transition-all"
        style={{
          left: '0.95rem',
          top: hasValue ? '0.3rem' : '0.85rem',
          fontSize: hasValue ? '0.7rem' : '0.95rem',
          color: hasValue ? '#0F3A7A' : '#6B7280',
          fontWeight: hasValue ? 600 : 400,
          background: 'white',
          padding: hasValue ? '0 0.25rem' : '0',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}
