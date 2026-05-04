'use client';

import { useState } from 'react';
import { Building2, Webhook, Mail, Trello, Copy, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [copied, setCopied] = useState(false);

  const examplePayload = JSON.stringify(
    {
      event: 'new_application',
      notificationEmail: 'jij@actiefwerkt.nl',
      trelloBoard: 'jouw-trello-bord',
      application: {
        id: 'uuid',
        created_at: '2026-01-20T10:30:00Z',
        vacancy_title: 'Elektromonteur Productie',
        vacancy_reference: '209408-A',
        vacancy_location: 'TWELLO',
        full_name: 'Jan de Vries',
        first_name: 'Jan',
        last_name: 'de Vries',
        email: 'jan@email.com',
        phone: '+31 6 12345678',
        country: 'Polen',
        postal_code: '1234 AB',
        house_number: '12',
        motivation: '...',
        cv_filename: 'cv.pdf',
        cv_url: 'https://jouwdomein.nl/api/cv/uuid',
      },
    },
    null,
    2
  );

  const copy = () => {
    navigator.clipboard.writeText(examplePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black aw-admin-title">Instellingen</h1>
        <p className="mt-1 text-gray-600">Configuratie van je ActiveWork</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: '#EFF4FB' }}
            >
              <Building2 className="w-5 h-5" style={{ color: '#0F3A7A' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#0F3A7A' }}>
                Configuratie
              </h3>
              <p className="text-sm text-gray-600">
                Deze instellingen staan in Vercel als Environment Variables
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <ConfigRow label="ADMIN_PASSWORD" value="•••••••• (verborgen)" />
            <ConfigRow label="NEXT_PUBLIC_SITE_URL" value="(zie Vercel)" />
            <ConfigRow label="WEBHOOK_URL" value="(zie Vercel)" />
            <ConfigRow label="NOTIFICATION_EMAIL" value="(zie Vercel)" />
            <ConfigRow label="TRELLO_BOARD" value="(zie Vercel)" />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Wijzig instellingen in Vercel → Project → Settings → Environment Variables. Na wijziging
            even opnieuw deployen.
          </p>
        </div>

        <div className="bg-white rounded border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-5">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: '#EFF4FB' }}
            >
              <Webhook className="w-5 h-5" style={{ color: '#0F3A7A' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#0F3A7A' }}>
                Automatisering (Zapier / Make / n8n)
              </h3>
              <p className="text-sm text-gray-600">
                Wanneer iemand solliciteert, stuurt de ActiveWork een webhook zodat je in Gmail + Trello
                een melding krijgt.
              </p>
            </div>
          </div>

          <div
            className="mt-5 rounded p-4 relative"
            style={{ background: '#0A2955' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-white/60">
                Voorbeeld webhook payload
              </span>
              <button
                onClick={copy}
                className="text-xs flex items-center gap-1"
                style={{ color: '#FFE81A' }}
              >
                {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Gekopieerd' : 'Kopieer'}
              </button>
            </div>
            <pre className="text-xs overflow-x-auto font-mono leading-relaxed text-gray-300">
              {examplePayload}
            </pre>
          </div>

          <div className="mt-5 space-y-2">
            <h4 className="font-black text-sm" style={{ color: '#0F3A7A' }}>
              Stap-voor-stap (Zapier):
            </h4>
            <ol className="text-sm space-y-1.5 list-decimal list-inside text-gray-800">
              <li>
                Maak een nieuwe Zap met <strong>Webhooks by Zapier → Catch Hook</strong> als trigger.
              </li>
              <li>
                Kopieer de webhook-URL die Zapier geeft, en plak die in Vercel als{' '}
                <code className="text-xs bg-gray-100 px-1 rounded">WEBHOOK_URL</code>.
              </li>
              <li>
                Voeg twee acties toe:
                <div className="ml-6 mt-1 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" style={{ color: '#0F3A7A' }} />
                    <strong>Gmail → Send Email</strong> met de sollicitatie-gegevens
                  </div>
                  <div className="flex items-center gap-2">
                    <Trello className="w-3.5 h-3.5" style={{ color: '#0F3A7A' }} />
                    <strong>Trello → Create Card</strong> op jouw bord
                  </div>
                </div>
              </li>
              <li>
                Doe in ActiveWork een test-sollicitatie om de velden in Zapier te mappen.
              </li>
              <li>Activeer de Zap. Klaar!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <code className="text-xs font-mono" style={{ color: '#0F3A7A' }}>
        {label}
      </code>
      <span className="text-xs text-gray-600">{value}</span>
    </div>
  );
}