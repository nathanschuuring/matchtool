import { createSupabaseAdmin } from './supabase';

export async function getSetting(key: string): Promise<string | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) return null;
  return data.value;
}

export async function setSetting(key: string, value: string): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });

  return !error;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from('settings').select('key, value');

  if (error || !data) return {};
  return Object.fromEntries(data.map((row) => [row.key, row.value || '']));
}
