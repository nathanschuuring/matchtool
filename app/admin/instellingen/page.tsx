import { getAllSettings } from '@/lib/settings';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function InstellingenPage() {
  const settings = await getAllSettings();
  return <SettingsForm initialSettings={settings} />;
}
