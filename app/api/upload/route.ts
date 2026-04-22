import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Geen bestand ontvangen' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Bestand is te groot (max 5 MB)' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Alleen PDF of Word-document toegestaan' }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const ext = file.name.split('.').pop() || 'bin';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from('cvs')
      .upload(fileName, arrayBuffer, { contentType: file.type });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ url: data.path, filename: file.name });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Upload mislukt' }, { status: 500 });
  }
}
