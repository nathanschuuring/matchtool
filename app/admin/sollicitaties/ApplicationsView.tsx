'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trash2, Download, CheckCircle } from 'lucide-react';
import type { Application } from '@/lib/types';

export default function ApplicationsView({ applications: initial }: { applications: Application[] }) {
  const router = useRouter();
  const [applications, setApplications] = useState(initial);
  const [selected, setSelected] = useState<Application | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deze sollicitatie definitief verwijderen?')) return;
    const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setApplications(applications.filter((a) => a.id !== id));
      showToast('Sollicitatie verwijderd');
      if (selected?.id === id) setSelected(null);
    } else {
      showToast('Verwijderen mislukt');
    }
    router.refresh();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-black aw-admin-title">Sollicitaties</h1>
        <p className="mt-1 text-gray-600">Alle binnengekomen reacties op jouw vacatures</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border-2 border-dashed rounded p-16 text-center border-gray-200">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-black mb-2" style={{ color: '#0F3A7A' }}>
            Nog geen sollicitaties
          </h3>
          <p className="text-gray-600">
            Zodra iemand reageert op een vacature, verschijnt die hier.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wide px-5 py-3 text-gray-600">
                  Naam
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wide px-5 py-3 text-gray-600">
                  Vacature
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wide px-5 py-3 text-gray-600">
                  Land
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wide px-5 py-3 text-gray-600">
                  Ontvangen
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(a)}>
                  <td className="px-5 py-3.5">
                    <div className="font-bold" style={{ color: '#0F3A7A' }}>
                      {a.first_name} {a.middle_name} {a.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-800">{a.vacancy_title}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-800">{a.country || '–'}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {a.created_at ? new Date(a.created_at).toLocaleString('nl-NL') : '–'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(a.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded max-w-xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h3
                className="text-2xl font-black"
                style={{ color: '#0F3A7A', letterSpacing: '-0.01em' }}
              >
                {selected.first_name} {selected.middle_name} {selected.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                {selected.vacancy_title} · {selected.vacancy_location}
              </p>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <Row label="E-mail">
                <a href={`mailto:${selected.email}`} style={{ color: '#0F3A7A' }}>
                  {selected.email}
                </a>
              </Row>
              <Row label="Telefoon">
                <a href={`tel:${selected.phone}`} style={{ color: '#0F3A7A' }}>
                  {selected.phone}
                </a>
              </Row>
              <Row label="Land">{selected.country || '–'}</Row>
              <Row label="Adres">
                {selected.postal_code} {selected.house_number}
              </Row>
              <Row label="Geboortedatum">{selected.date_of_birth || '–'}</Row>
              <Row label="CV">
                {selected.cv_url ? (
                  <a
                    href={`/api/cv/${selected.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold"
                    style={{ color: '#0F3A7A' }}
                  >
                    <Download className="w-3.5 h-3.5" /> {selected.cv_filename || 'Download CV'}
                  </a>
                ) : (
                  '–'
                )}
              </Row>
              {selected.motivation && (
                <Row label="Motivatie">
                  <div className="whitespace-pre-wrap">{selected.motivation}</div>
                </Row>
              )}
              <Row label="Ontvangen">
                {selected.created_at ? new Date(selected.created_at).toLocaleString('nl-NL') : '–'}
              </Row>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-bold text-gray-600"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50"
          style={{ background: '#0F3A7A', color: 'white' }}
        >
          <CheckCircle className="w-4 h-4" style={{ color: '#FFE81A' }} />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-0.5" style={{ color: '#0F3A7A', fontWeight: 500 }}>
        {children}
      </div>
    </div>
  );
}
