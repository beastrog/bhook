'use client';

import { useState, useTransition } from 'react';
import { Save, LogOut } from 'lucide-react';
import { updateSetting } from '@/app/admin/actions';
import { adminLogout } from '@/app/admin/actions';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
    const [form, setForm] = useState({
        store_name: settings.store_name || 'Bhook',
        admin_room: settings.admin_room || '',
        announcement: settings.announcement || '',
        store_open: settings.store_open || 'true',
    });
    const [isPending, startTransition] = useTransition();

    const handleSave = async () => {
        startTransition(async () => {
            for (const [key, value] of Object.entries(form)) {
                await updateSetting(key, value);
            }
            toast.success('Settings saved!');
        });
    };

    return (
        <div className="px-5 pt-5">
            <h1 className="text-xl font-black mb-5" style={{ color: 'var(--on-surface)' }}>Settings</h1>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--on-surface-muted)' }}>Store Name</label>
                    <input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-card)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                </div>

                <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--on-surface-muted)' }}>Your Room Number (for pickup instructions)</label>
                    <input value={form.admin_room} onChange={(e) => setForm({ ...form, admin_room: e.target.value })}
                        placeholder="e.g. G-204"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-card)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                </div>

                <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--on-surface-muted)' }}>Announcement (shown on homepage)</label>
                    <input value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })}
                        placeholder="e.g. Fresh stock tonight! 🔥"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-card)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                </div>

                <div>
                    <label className="text-xs font-semibold mb-2 block" style={{ color: 'var(--on-surface-muted)' }}>Store Status</label>
                    <div className="flex gap-2">
                        {['true', 'false'].map((v) => (
                            <button key={v}
                                onClick={() => setForm({ ...form, store_open: v })}
                                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                                style={form.store_open === v
                                    ? { background: v === 'true' ? 'rgba(91,240,131,0.2)' : 'rgba(255,110,132,0.1)', color: v === 'true' ? '#5bf083' : '#ff6e84' }
                                    : { background: 'var(--bg-card)', color: 'var(--on-surface-muted)' }}
                            >
                                {v === 'true' ? '🟢 Open' : '🔴 Closed'}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleSave} disabled={isPending}
                    className="btn-primary w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save size={16} /> {isPending ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Danger zone */}
            <div className="rounded-2xl p-4 mb-4" style={{ border: '1px solid rgba(255,110,132,0.2)' }}>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#ff6e84' }}>Account</h3>
                <button
                    onClick={() => adminLogout()}
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: '#ff6e84' }}
                >
                    <LogOut size={14} /> Sign out of admin
                </button>
            </div>

            <div className="rounded-2xl p-4" style={{ background: 'var(--bg-low)', border: '1px solid rgba(69,72,82,0.3)' }}>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--on-surface)' }}>Profit Split Config</h3>
                <Link href="/admin/profit-split" className="text-sm" style={{ color: 'var(--primary)' }}>
                    Manage profit splits →
                </Link>
            </div>
        </div>
    );
}
