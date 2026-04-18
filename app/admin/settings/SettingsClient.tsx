'use client';

import { useState, useTransition } from 'react';
import { updateSetting } from '@/app/admin/actions';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

const SETTINGS = [
    { key: 'store_name', label: 'Store Name', placeholder: 'Bhookh' },
    { key: 'store_tagline', label: 'Tagline', placeholder: 'Midnight Snack Store' },
    { key: 'upi_id', label: 'UPI ID', placeholder: 'someone@upi' },
    { key: 'contact_phone', label: 'Contact Phone', placeholder: '+91 98765 43210' },
];

export default function SettingsClient({ settings }: { settings: Record<string, string> }) {
    const [form, setForm] = useState(settings);
    const [isPending, startTransition] = useTransition();

    const handleSave = async (key: string) => {
        startTransition(async () => {
            const { error } = await updateSetting(key, form[key] || '');
            if (error) { toast.error(error); return; }
            toast.success('Saved');
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-0.5">Configuration</p>
            <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-5">Settings</h1>

            <div className="bg-card border border-bdr rounded-2xl divide-y divide-bdr overflow-hidden">
                {SETTINGS.map(({ key, label, placeholder }) => (
                    <div key={key} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2.5">
                        <label className="w-full sm:w-36 text-sm font-semibold flex-shrink-0">{label}</label>
                        <div className="flex gap-2 flex-1">
                            <input className="flex-1 bg-deep border border-bdr rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors"
                                placeholder={placeholder} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                            <button onClick={() => handleSave(key)} disabled={isPending}
                                className="w-10 h-10 flex items-center justify-center bg-lime text-[#000000] rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40 flex-shrink-0">
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-bdr">
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-err mb-3">Danger Zone</p>
                <div className="bg-err/5 border border-err/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-sm text-err">Reset All Data</h3>
                        <p className="text-xs text-t3 mt-1">This will delete all orders, resetting profit calculations and analytics permanently.</p>
                    </div>
                    <button
                        onClick={async () => {
                            if (!confirm('Are you absolutely sure? This cannot be undone.')) return;
                            startTransition(async () => {
                                const { resetAppData } = await import('@/app/admin/actions');
                                const { error } = await resetAppData();
                                if (error) toast.error(error);
                                else toast.success('All app data has been reset.');
                            });
                        }}
                        disabled={isPending}
                        className="bg-err text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-err/80 transition-colors active:scale-[0.97] whitespace-nowrap">
                        {isPending ? 'Resetting...' : 'Reset Profit & Orders'}
                    </button>
                </div>
            </div>
        </div>
    );
}
