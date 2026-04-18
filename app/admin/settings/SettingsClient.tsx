'use client';

import { useState, useTransition } from 'react';
import { updateSetting } from '@/app/admin/actions';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

const SETTINGS = [
    { key: 'store_name', label: 'Store Name', placeholder: 'Bhook' },
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
                                className="w-10 h-10 flex items-center justify-center bg-lime text-deep rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40 flex-shrink-0">
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
