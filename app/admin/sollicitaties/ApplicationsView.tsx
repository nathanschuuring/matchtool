'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Trash2, Download, CheckCircle, Filter } from 'lucide-react';
import type { Application, ApplicationStatus } from '@/lib/types';
import { APPLICATION_STATUSES } from '@/lib/types';

// Kleur-mapping per status
const STATUS_STYLES: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  'Nieuw': { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6' },
  'In behandeling': { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  'Aangenomen': { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  'Afgewezen': { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export default function ApplicationsView({ applications: initial }: { applications: Application[] }) {
  const router = useRouter();
  const [applications, setApplications] = useState(initial);
  const [selected, setSelected] = useState<Application | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | 'Alle'>('Alle');
  const [updating, setUpdating] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Tellertjes per status
  const counts = useMemo(() => {
    const c: Record<string, number> = { Alle: applications.length };
    APPLICATION_STATUSES.forEach((s) => {
      c[s] = applications.filter((a) => (a.status || 'Nieuw') === s).length;
    });
    return c;
  }, [applications]);

  // Gefilterde lijst
  const filtered = useMemo(() => {
    if (filter === 'Alle') return applications;
    return applications.filter((a) => (a.status || 'Nieuw') === filter);
  }, [applications, filter]);

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

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    setUpdating(id);
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setApplications(
        applications.map((a) =>
          a.id === id ? { ...a, status: newStatus, status_updated_at: new Date().toISOString() } : a
        )
      );
      showToast(`Status bijgewerkt naar "${newStatus}"`);
    } else {
      showToast('Bijwerken mislukt');
    }
    setUpdating(null);
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
        <>
          {/* Filter-tabs */}
          <div className="mb-5 flex flex-wrap gap-2">
            <FilterTab
              label="Alle"
              count={counts['Alle']}
              active={filter === 'Alle'}
              onClick={() => setFilter('Alle')}
            />
            {APPLICATION_STATUSES.map((s) => (
              <FilterTab
                key={s}
                label={s}
                count={counts[s] || 0}
                active={filter === s}
                onClick={() => setFilter(s)}
                color={STATUS_STYLES[s].dot}
              />
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border-2 border-dashed rounded p-12 text-center border-gray-200">
              <Filter className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600">Geen sollicitaties met status "{filter}"</p>
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
                      Status
                    </th>
                    <th className="text-left text-xs font-bold uppercase tracking-wide px-5 py-3 text-gray-600">
                      Ontvangen
                    </th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((a) => {
                    const status: ApplicationStatus = (a.status as ApplicationStatus) || 'Nieuw';
                    const styles = STATUS_STYLES[status];
                    return (
                      <tr
                        key={a.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelected(a)}
                      >
                        <td className="px-5 py-3.5">
                          <div className="font-bold" style={{ color: '#0F3A7A' }}>
                            {a.first_name} {a.middle_name} {a.last_name}
                          </div>
                          <div className="text-xs text-gray-500">{a.email}</div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-800">{a.vacancy_title}</td>
                        <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block">
                            <select
                              value={status}
                              onChange={(e) =>
                                handleStatusChange(a.id, e.target.value as ApplicationStatus)
                              }
                              disabled={updating === a.id}
                              className="appearance-none cursor-pointer text-xs font-bold px-3 py-1.5 pr-7 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
                              style={{
                                background: styles.bg,
                                color: styles.text,
                                opacity: updating === a.id ? 0.5 : 1,
                              }}
                            >
                              {APPLICATION_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <svg
                              className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                              style={{ color: styles.text }}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </td>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
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
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3
                  className="text-2xl font-black"
                  style={{ color: '#0F3A7A', letterSpacing: '-0.01em' }}
                >
                  {selected.first_name} {selected.middle_name} {selected.last_name}
                </h3>
                <StatusBadge status={(selected.status as ApplicationStatus) || 'Nieuw'} />
              </div>
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

function FilterTab({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition border"
      style={{
        background: active ? '#0F3A7A' : 'white',
        color: active ? 'white' : '#374151',
        borderColor: active ? '#0F3A7A' : '#E5E7EB',
      }}
    >
      {color && (
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: color }}
        />
      )}
      {label}
      <span
        className="text-xs px-1.5 py-0.5 rounded-full font-bold"
        style={{
          background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
          color: active ? 'white' : '#6B7280',
        }}
      >
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles = STATUS_STYLES[status];
  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 flex-shrink-0"
      style={{ background: styles.bg, color: styles.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: styles.dot }} />
      {status}
    </span>
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
