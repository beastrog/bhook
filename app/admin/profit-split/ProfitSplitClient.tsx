'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { upsertProfitSplit, deleteProfitSplit } from '@/app/admin/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfitSplitClient({ splits: initialSplits, todayProfit }: { splits: any[]; todayProfit: number }) {
    const [splits, setSplits] = useState(initialSplits);
    const [form, setForm] = useState({ person_name: '', percentage: '' });
    const [isPending, startTransition] = useTransition();

    const totalPct = splits.reduce((s, p) => s + Number(p.percentage), 0);

    const handleAdd = async () => {
        if (!form.person_name.trim() || !form.percentage) { toast.error('Fill all fields'); return; }
        const pct = +form.percentage;
        if (pct <= 0 || pct > 100) { toast.error('Percentage must be 1-100'); return; }
        startTransition(async () => {
            const { error } = await upsertProfitSplit({ person_name: form.person_name, percentage: pct });
            if (error) { toast.error(error); return; }
            toast.success('Added!');
            setForm({ person_name: '', percentage: '' });
            window.location.reload();
        });
    };

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const { error } = await deleteProfitSplit(id);
            if (error) { toast.error(error); return; }
            setSplits((prev) => prev.filter((s) => s.id !== id));
            toast.success('Removed');
        });
    };

    return (
        <div className="px-5 pt-5">
            <h1 className="text-xl font-black mb-1" style={{ color: 'var(--on-surface)' }}>Profit Split</h1>
            <p className="text-sm mb-5" style={{ color: 'var(--on-surface-muted)' }}>Configure how profits are divided</p>

            {/* Today summary */}
            {todayProfit > 0 && (
                <div className="glass rounded-2xl p-4 mb-5">
                    <p className="text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>Today&apos;s profit to split</p>
                    <p className="text-2xl font-black" style={{ color: '#5bf083' }}>{formatCurrency(todayProfit)}</p>
                </div>
            )}

            {/* Splits */}
            <div className="space-y-3 mb-6">
                {splits.map((s) => {
                    const amount = (todayProfit * s.percentage) / 100;
                    return (
                        <motion.div key={s.id} layout className="glass rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-bold" style={{ color: 'var(--on-surface)' }}>{s.person_name}</p>
                                    <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>{s.percentage}%</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {todayProfit > 0 && (
                                        <span className="font-black" style={{ color: 'var(--secondary)' }}>{formatCurrency(amount)}</span>
                                    )}
                                    <button onClick={() => handleDelete(s.id)} disabled={isPending}
                                        className="p-1.5 rounded-lg" style={{ background: 'rgba(255,110,132,0.1)', color: '#ff6e84' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full rounded-full h-1.5" style={{ background: 'var(--bg-card-high)' }}>
                                <div className="h-1.5 rounded-full" style={{ width: `${s.percentage}%`, background: 'linear-gradient(90deg, #ba9eff, #8455ef)' }} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {totalPct !== 100 && splits.length > 0 && (
                <div className="flex items-center gap-2 text-sm mb-5 px-4 py-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24' }}>
                    <AlertTriangle size={14} /> Total is {totalPct}% (should be exactly 100%)
                </div>
            )}

            {/* Add form */}
            <div className="glass rounded-2xl p-4">
                <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--on-surface)' }}>Add Person</h3>
                <div className="space-y-3">
                    <input
                        placeholder="Person name"
                        value={form.person_name}
                        onChange={(e) => setForm({ ...form, person_name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }}
                    />
                    <input
                        placeholder="Percentage (e.g. 60)"
                        type="number"
                        value={form.percentage}
                        onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }}
                    />
                    <button onClick={handleAdd} disabled={isPending}
                        className="btn-primary w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Plus size={16} /> Add Partner
                    </button>
                </div>
            </div>
        </div>
    );
}
