import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data: app, error } = await supabase
      .from('applications')
      .select('cv_url, cv_filename')
      .eq('id', params.id)
      .single();

    if (error || !app || !app.cv_url) {
      return NextResponse.json({ error: 'CV niet gevonden' }, { status: 404 });
    }

    const { data: fileData, error: fileError } = await supabase.storage
      .from('cvs')
      .download(app.cv_url);

    if (fileError || !fileData) {
      return NextResponse.json({ error: 'Bestand niet gevonden' }, { status: 404 });
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileData.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${app.cv_filename || 'cv.pdf'}"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
