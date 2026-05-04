import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { getSetting } from '@/lib/settings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.first_name || !body.last_name || !body.email || !body.phone) {
      return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('applications')
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Stuur notificatie-mail via Resend (non-blocking)
    sendNotificationEmail(data).catch((e) =>
      console.error('Notification email failed:', e)
    );

    // Webhook (Zapier / Make / n8n) — non-blocking
    if (process.env.WEBHOOK_URL) {
      fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_application',
          application: data,
        }),
      }).catch((e) => console.error('Webhook failed:', e));
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Onbekende fout' }, { status: 500 });
  }
}

async function sendNotificationEmail(application: any) {
  const recipient = await getSetting('notification_email');
  if (!recipient) {
    console.log('Geen notification_email ingesteld, mail overgeslagen');
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY ontbreekt');
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@activework.tech';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://activework.tech';

  const fullName = `${application.first_name} ${application.middle_name || ''} ${application.last_name}`
    .replace(/\s+/g, ' ')
    .trim();

  const subject = `🆕 Nieuwe sollicitatie: ${fullName} voor ${application.vacancy_title}`;

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1A1A1A;">
      <div style="background: #0F3A7A; color: white; padding: 24px; border-radius: 6px 6px 0 0;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 800;">🆕 Nieuwe sollicitatie</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.85; font-size: 14px;">Op ActiveWork is een nieuwe sollicitatie binnengekomen.</p>
      </div>

      <div style="background: #F8F8F8; padding: 24px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 6px 6px;">

        <h2 style="color: #0F3A7A; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Vacature</h2>
        <p style="margin: 0 0 24px 0; font-size: 16px;">
          <strong>${escapeHtml(application.vacancy_title || '–')}</strong><br>
          ${escapeHtml(application.vacancy_location || '')}
          ${application.vacancy_reference ? ` · #${escapeHtml(application.vacancy_reference)}` : ''}
        </p>

        <h2 style="color: #0F3A7A; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0;">Kandidaat</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; font-size: 15px;">
          <tr>
            <td style="color: #6B7280; width: 100px; vertical-align: top;">Naam</td>
            <td><strong>${escapeHtml(fullName)}</strong></td>
          </tr>
          <tr>
            <td style="color: #6B7280; vertical-align: top;">E-mail</td>
            <td><a href="mailto:${escapeHtml(application.email)}" style="color: #0F3A7A; text-decoration: none;">${escapeHtml(application.email)}</a></td>
          </tr>
          <tr>
            <td style="color: #6B7280; vertical-align: top;">Telefoon</td>
            <td><a href="tel:${escapeHtml(application.phone)}" style="color: #0F3A7A; text-decoration: none;">${escapeHtml(application.phone)}</a></td>
          </tr>
          ${application.country ? `
          <tr>
            <td style="color: #6B7280; vertical-align: top;">Land</td>
            <td>${escapeHtml(application.country)}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 32px; text-align: center;">
          <a href="${siteUrl}/admin/sollicitaties"
             style="display: inline-block; background: #FFE81A; color: #0F3A7A; padding: 14px 28px; text-decoration: none; font-weight: 700; border-radius: 4px; font-size: 14px;">
            Bekijk in ActiveWork →
          </a>
        </div>

      </div>

      <p style="text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 16px;">
        Deze mail is automatisch verzonden door ActiveWork.
      </p>
    </div>
  `;

  const text = `Nieuwe sollicitatie op ActiveWork

Vacature: ${application.vacancy_title} (${application.vacancy_location})
Referentie: ${application.vacancy_reference || '–'}

Kandidaat:
- Naam: ${fullName}
- E-mail: ${application.email}
- Telefoon: ${application.phone}
${application.country ? `- Land: ${application.country}` : ''}

Bekijk in ActiveWork: ${siteUrl}/admin/sollicitaties
`;

  // Ondersteun comma-gescheiden lijst van adressen
  const recipients = recipient.split(',').map((r) => r.trim()).filter(Boolean);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: recipients,
      subject,
      html,
      text,
      reply_to: application.email,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Resend error:', response.status, errorBody);
    throw new Error(`Resend API failed: ${response.status}`);
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
