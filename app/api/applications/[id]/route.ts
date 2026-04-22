import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

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
