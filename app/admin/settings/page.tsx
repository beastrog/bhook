import { getSettings } from '@/app/actions';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const settings = await getSettings();
    return <SettingsClient settings={settings} />;
}
