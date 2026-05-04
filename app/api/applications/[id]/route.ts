import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { APPLICATION_STATUSES } from '@/lib/types';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  // Also try to delete the CV file
  const { data: app } = await supabase
    .from('applications')
    .select('cv_url')
    .eq('id', params.id)
    .single();

  if (app?.cv_url) {
    await supabase.storage.from('cvs').remove([app.cv_url]).catch(() => {});
  }

  const { error } = await supabase.from('applications').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updates: Record<string, any> = {};

    // Alleen status kunnen we (voorlopig) wijzigen
    if (body.status !== undefined) {
      if (!APPLICATION_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 });
      }
      updates.status = body.status;
      updates.status_updated_at = new Date().toISOString();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Geen geldige velden om bij te werken' }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const { error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Onbekende fout' }, { status: 500 });
  }
}
