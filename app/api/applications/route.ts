import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

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

    // Fire webhook (Zapier / Make / n8n) — non-blocking
    if (process.env.WEBHOOK_URL) {
      fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'new_application',
          notificationEmail: process.env.NOTIFICATION_EMAIL,
          trelloBoard: process.env.TRELLO_BOARD,
          application: {
            id: data.id,
            created_at: data.created_at,
            vacancy_title: data.vacancy_title,
            vacancy_reference: data.vacancy_reference,
            vacancy_location: data.vacancy_location,
            full_name: `${data.first_name} ${data.middle_name || ''} ${data.last_name}`
              .replace(/\s+/g, ' ')
              .trim(),
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            country: data.country,
            postal_code: data.postal_code,
            house_number: data.house_number,
            date_of_birth: data.date_of_birth,
            motivation: data.motivation,
            cv_filename: data.cv_filename,
            cv_url: data.cv_url
              ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/cv/${data.id}`
              : null,
          },
        }),
      }).catch((e) => console.error('Webhook failed:', e));
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Onbekende fout' }, { status: 500 });
  }
}
