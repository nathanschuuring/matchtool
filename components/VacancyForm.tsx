'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, CheckCircle, Plus, Trash2 } from 'lucide-react';
import type { Vacancy } from '@/lib/types';
import { generateReference } from '@/lib/utils';

export default function VacancyForm({ vacancy }: { vacancy?: Vacancy }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    reference_number: vacancy?.reference_number || generateReference(),
    title: vacancy?.title || '',
    location: vacancy?.location || '',
    contract_type: vacancy?.contract_type || 'Tijdelijk met uitzicht op vast',
    hours: vacancy?.hours || 40,
    salary_min: vacancy?.salary_min || '',
    salary_max: vacancy?.salary_max || '',
    category: vacancy?.category || '',
    description: vacancy?.description || '',
    responsibilities: vacancy?.responsibilities?.length ? vacancy.responsibilities : [''],
    offer: vacancy?.offer?.length ? vacancy.offer : ['', '', ''],
    about_employer: vacancy?.about_employer || '',
    requirements_intro: vacancy?.requirements_intro || '',
    requirements: vacancy?.requirements?.length ? vacancy.requirements : [''],
  });

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });
  const updateList = (field: string, idx: number, value: string) => {
    const list = [...(form as any)[field]];
    list[idx] = value;
    update(field, list);
  };
  const addItem = (field: string) => update(field, [...(form as any)[field], '']);
  const removeItem = (field: string, idx: number) =>
    update(
      field,
      (form as any)[field].filter((_: any, i: number) => i !== idx)
    );

  const canSave =
    form.title && form.location && form.description && form.salary_min && form.salary_max;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.filter((x) => x.trim()),
        offer: form.offer.filter((x) => x.trim()),
        requirements: form.requirements.filter((x) => x.trim()),
      };

      const url = vacancy ? `/api/vacancies/${vacancy.id}` : '/api/vacancies';
      const method = vacancy ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Opslaan mislukt');
      }

      router.push('/admin');
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin"
          className="text-sm flex items-center gap-1 mb-2 font-bold text-gray-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Terug
        </Link>
        <h1 className="text-4xl font-black aw-admin-title">
          {vacancy ? 'Vacature bewerken' : 'Nieuwe vacature'}
        </h1>
      </div>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex-1 h-1 rounded-full transition-all"
            style={{ background: step >= n ? '#FFE81A' : '#E5E7EB' }}
          />
        ))}
      </div>

      <div className="bg-white rounded border border-gray-200 p-6 md:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black mb-1" style={{ color: '#0F3A7A' }}>
                Basisgegevens
              </h2>
              <p className="text-sm text-gray-600">De hoofdinformatie van de vacature</p>
            </div>
            <Field label="Functietitel" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="bijv. Elektromonteur Productie in Apeldoorn"
                className="aw-input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Locatie" required>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="bijv. TWELLO"
                  className="aw-input"
                />
              </Field>
              <Field label="Vakgebied">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  placeholder="bijv. Productie"
                  className="aw-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Uren per week">
                <input
                  type="number"
                  value={form.hours}
                  onChange={(e) => update('hours', e.target.value)}
                  className="aw-input"
                />
              </Field>
              <Field label="Contractvorm">
                <input
                  type="text"
                  value={form.contract_type}
                  onChange={(e) => update('contract_type', e.target.value)}
                  placeholder="Tijdelijk met uitzicht op vast, Vast"
                  className="aw-input"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Salaris min (€/mnd)" required>
                <input
                  type="text"
                  value={form.salary_min}
                  onChange={(e) => update('salary_min', e.target.value)}
                  placeholder="3000"
                  className="aw-input"
                />
              </Field>
              <Field label="Salaris max (€/mnd)" required>
                <input
                  type="text"
                  value={form.salary_max}
                  onChange={(e) => update('salary_max', e.target.value)}
                  placeholder="4000"
                  className="aw-input"
                />
              </Field>
            </div>
            <Field label="Referentienummer">
              <input
                type="text"
                value={form.reference_number}
                onChange={(e) => update('reference_number', e.target.value)}
                className="aw-input"
              />
            </Field>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                disabled={!form.title || !form.location}
                className="aw-btn-blue"
              >
                Volgende <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black mb-1" style={{ color: '#0F3A7A' }}>
                Inhoud van de vacature
              </h2>
              <p className="text-sm text-gray-600">Omschrijving en aanbod</p>
            </div>
            <Field label="Omschrijving" required>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={6}
                placeholder="Algemene omschrijving van de functie..."
                className="aw-input"
              />
            </Field>
            <Field label="Extra verantwoordelijkheden (optioneel)">
              <p className="text-xs mb-2 text-gray-500">
                Worden getoond als bullets na 'Lees meer'. Laat leeg als ze al in de omschrijving staan.
              </p>
              <ListEditor
                items={form.responsibilities}
                onChange={(i, v) => updateList('responsibilities', i, v)}
                onAdd={() => addItem('responsibilities')}
                onRemove={(i) => removeItem('responsibilities', i)}
                placeholder="bijv. Oplossen van storingen"
              />
            </Field>
            <Field label="Wat wij jou bieden">
              <ListEditor
                items={form.offer}
                onChange={(i, v) => updateList('offer', i, v)}
                onAdd={() => addItem('offer')}
                onRemove={(i) => removeItem('offer', i)}
                placeholder="bijv. Bruto maandsalaris tussen de €3000 en €4000;"
              />
            </Field>
            <Field label="Over de opdrachtgever">
              <textarea
                value={form.about_employer}
                onChange={(e) => update('about_employer', e.target.value)}
                rows={3}
                placeholder="Beschrijving van het bedrijf..."
                className="aw-input"
              />
            </Field>
            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 font-bold text-gray-600">
                ← Vorige
              </button>
              <button onClick={() => setStep(3)} className="aw-btn-blue">
                Volgende <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black mb-1" style={{ color: '#0F3A7A' }}>
                Functie-eisen
              </h2>
              <p className="text-sm text-gray-600">Wat wij van de kandidaat vragen</p>
            </div>
            <Field label="Intro (optioneel)">
              <textarea
                value={form.requirements_intro}
                onChange={(e) => update('requirements_intro', e.target.value)}
                rows={2}
                placeholder="Korte intro over het profiel..."
                className="aw-input"
              />
            </Field>
            <Field label="Specifieke eisen">
              <ListEditor
                items={form.requirements}
                onChange={(i, v) => updateList('requirements', i, v)}
                onAdd={() => addItem('requirements')}
                onRemove={(i) => removeItem('requirements', i)}
                placeholder="bijv. Een afgeronde technische MBO opleiding;"
              />
            </Field>

            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="px-5 py-2.5 font-bold text-gray-600">
                ← Vorige
              </button>
              <button onClick={handleSave} disabled={!canSave || saving} className="aw-btn-blue">
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Bezig...' : vacancy ? 'Opslaan' : 'Publiceren'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold mb-1.5 block text-gray-800">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function ListEditor({
  items,
  onChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onChange: (idx: number, value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onChange(idx, e.target.value)}
            placeholder={placeholder}
            className="aw-input flex-1"
          />
          {items.length > 1 && (
            <button
              onClick={() => onRemove(idx)}
              className="px-2.5 rounded hover:bg-red-50 text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-sm font-bold flex items-center gap-1"
        style={{ color: '#0F3A7A' }}
      >
        <Plus className="w-3.5 h-3.5" /> Regel toevoegen
      </button>
    </div>
  );
}
