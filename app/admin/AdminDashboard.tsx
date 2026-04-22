'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase, MapPin, Clock, Euro, Share2, Plus, Eye, Users, Edit, Trash2,
  Copy, ExternalLink, Facebook, Instagram, CheckCircle,
} from 'lucide-react';
import type { Vacancy } from '@/lib/types';
import { formatSalary } from '@/lib/utils';

export default function AdminDashboard({
  vacancies: initialVacancies,
  applications,
  siteUrl,
}: {
  vacancies: Vacancy[];
  applications: { id: string; vacancy_id?: string }[];
  siteUrl: string;
}) {
  const router = useRouter();
  const [vacancies, setVacancies] = useState(initialVacancies);
  const [shareFor, setShareFor] = useState<Vacancy | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Vacancy | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const res = await fetch(`/api/vacancies/${confirmDelete.id}`, { method: 'DELETE' });
    if (res.ok) {
      setVacancies(vacancies.filter((v) => v.id !== confirmDelete.id));
      showToast('Vacature verwijderd');
    } else {
      showToast('Verwijderen mislukt');
    }
    setConfirmDelete(null);
    router.refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black aw-admin-title">Vacatures</h1>
          <p className="mt-1 text-gray-600">Beheer en publiceer openstaande vacatures</p>
        </div>
        <Link href="/admin/vacatures/nieuw" className="aw-btn-blue">
          <Plus className="w-4 h-4" /> Nieuwe vacature
        </Link>
      </div>

      {vacancies.length === 0 ? (
        <div className="bg-white border-2 border-dashed rounded p-16 text-center border-gray-200">
          <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-black mb-2" style={{ color: '#0F3A7A' }}>
            Nog geen vacatures
          </h3>
          <p className="mb-6 text-gray-600">Maak je eerste vacature aan om te beginnen</p>
          <Link href="/admin/vacatures/nieuw" className="aw-btn-blue">
            <Plus className="w-4 h-4" /> Nieuwe vacature
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vacancies.map((v) => {
            const appCount = applications.filter((a) => a.vacancy_id === v.id).length;
            return (
              <div
                key={v.id}
                className="bg-white rounded hover:shadow-lg transition overflow-hidden border border-gray-200"
              >
                <div className="h-1" style={{ background: '#FFE81A' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded"
                      style={{ background: '#EFF4FB', color: '#0F3A7A' }}
                    >
                      #{v.reference_number}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{v.category}</span>
                  </div>
                  <h3
                    className="text-lg font-black mb-3"
                    style={{ color: '#0F3A7A', letterSpacing: '-0.01em' }}
                  >
                    {v.title}
                  </h3>
                  <div className="space-y-1.5 text-sm mb-4 text-gray-800">
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
                  {appCount > 0 && (
                    <div
                      className="mb-3 text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1"
                      style={{ background: '#DCFCE7', color: '#166534' }}
                    >
                      <Users className="w-3 h-3" /> {appCount} sollicitatie{appCount !== 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-200">
                    <Link
                      href={`/vacature/${v.slug}`}
                      target="_blank"
                      className="text-xs font-bold px-2.5 py-1.5 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                      <Eye className="w-3 h-3" /> Bekijk
                    </Link>
                    <Link
                      href={`/admin/vacatures/${v.id}`}
                      className="text-xs font-bold px-2.5 py-1.5 rounded flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800"
                    >
                      <Edit className="w-3 h-3" /> Bewerk
                    </Link>
                    <button
                      onClick={() => setShareFor(v)}
                      className="text-xs font-bold px-2.5 py-1.5 rounded flex items-center gap-1"
                      style={{ background: '#FFE81A', color: '#0F3A7A' }}
                    >
                      <Share2 className="w-3 h-3" /> Deel
                    </button>
                    <button
                      onClick={() => setConfirmDelete(v)}
                      className="ml-auto p-1.5 rounded hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {shareFor && (
        <ShareModal
          vacancy={shareFor}
          siteUrl={siteUrl}
          onClose={() => setShareFor(null)}
          showToast={showToast}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="bg-white rounded max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: '#FEE2E2' }}
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3
                  className="text-xl font-black mb-2"
                  style={{ color: '#0F3A7A', letterSpacing: '-0.01em' }}
                >
                  Vacature verwijderen?
                </h3>
                <p className="text-sm text-gray-800">
                  Weet je zeker dat je <strong>"{confirmDelete.title}"</strong> wilt verwijderen? Deze
                  actie kan niet ongedaan worden gemaakt.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 rounded text-sm font-bold bg-gray-100 text-gray-800"
              >
                Annuleren
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded text-sm font-bold text-white flex items-center gap-2 bg-red-600"
              >
                <Trash2 className="w-4 h-4" /> Verwijderen
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

function ShareModal({
  vacancy,
  siteUrl,
  onClose,
  showToast,
}: {
  vacancy: Vacancy;
  siteUrl: string;
  onClose: () => void;
  showToast: (msg: string) => void;
}) {
  const url = `${siteUrl}/vacature/${vacancy.slug}`;
  const shareText = `🔧 ${vacancy.title} in ${vacancy.location} | ${vacancy.hours} uur | € ${formatSalary(vacancy.salary_min)} - € ${formatSalary(vacancy.salary_max)} per maand. Solliciteer direct! ${url}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Gekopieerd');
    } catch {
      showToast('Kopiëren mislukt');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-black mb-1" style={{ color: '#0F3A7A' }}>
          Deel deze vacature
        </h3>
        <p className="text-sm text-gray-600 mb-5">Deel op Meta of kopieer een link</p>

        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-600">
            Publieke URL
          </label>
          <div className="mt-1 flex gap-2">
            <input readOnly value={url} className="aw-input flex-1 bg-gray-50" />
            <button
              onClick={() => copy(url)}
              className="px-3 rounded text-sm font-bold flex items-center gap-1 bg-gray-100 text-gray-800"
            >
              <Copy className="w-3.5 h-3.5" /> Kopie
            </button>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-600">
            Voorgestelde tekst
          </label>
          <textarea readOnly value={shareText} rows={3} className="aw-input mt-1 bg-gray-50" />
          <button
            onClick={() => copy(shareText)}
            className="mt-1 text-xs font-bold flex items-center gap-1"
            style={{ color: '#0F3A7A' }}
          >
            <Copy className="w-3 h-3" /> Kopieer tekst
          </button>
        </div>

        <div className="space-y-2">
          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-3 rounded font-bold text-white"
            style={{ background: '#1877F2' }}
          >
            <span className="flex items-center gap-3">
              <Facebook className="w-5 h-5" /> Delen op Facebook
            </span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => copy(shareText)}
            className="w-full flex items-center justify-between px-4 py-3 rounded font-bold text-white"
            style={{ background: 'linear-gradient(90deg, #833AB4, #FD1D1D, #FCAF45)' }}
          >
            <span className="flex items-center gap-3">
              <Instagram className="w-5 h-5" /> Kopieer voor Instagram
            </span>
            <Copy className="w-4 h-4" />
          </button>
          <p className="text-xs pt-2 text-gray-600">
            Instagram ondersteunt geen directe link-sharing. Kopieer de tekst en plak hem in je post.
          </p>
        </div>

        <button onClick={onClose} className="mt-5 w-full py-2.5 text-sm font-bold text-gray-600">
          Sluiten
        </button>
      </div>
    </div>
  );
}
