import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from('vacancies').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const payload = {
      reference_number: body.reference_number,
      slug: body.slug || slugify(body.title),
      title: body.title,
      location: body.location,
      contract_type: body.contract_type,
      hours: parseInt(body.hours) || 40,
      salary_min: String(body.salary_min || ''),
      salary_max: String(body.salary_max || ''),
      category: body.category,
      description: body.description,
      responsibilities: body.responsibilities || [],
      offer: body.offer || [],
      about_employer: body.about_employer,
      requirements_intro: body.requirements_intro,
      requirements: body.requirements || [],
      published: body.published !== false,
    };

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from('vacancies')
      .update(payload)
      .eq('id', params.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('vacancies').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
