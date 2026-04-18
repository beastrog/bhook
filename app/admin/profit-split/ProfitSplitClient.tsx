'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { ProfitSplit } from '@/lib/types';
import { upsertProfitSplit, deleteProfitSplit } from '@/app/admin/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfitSplitClient({ splits: initSplits, todayProfit }: { splits: ProfitSplit[]; todayProfit: number }) {
    const [splits, setSplits] = useState(initSplits);
    const [name, setName] = useState('');
    const [pct, setPct] = useState<number>(0);
    const [isPending, startTransition] = useTransition();
    const totalPct = splits.reduce((s, p) => s + Number(p.percentage), 0);

    const handleAdd = async () => {
        if (!name.trim()) { toast.error('Name required'); return; }
        if (pct <= 0 || pct > 100) { toast.error('1-100%'); return; }
        if (totalPct + pct > 100) { toast.error('Exceeds 100%'); return; }
        startTransition(async () => {
            const { error } = await upsertProfitSplit({ person_name: name, percentage: pct, active: true });
            if (error) { toast.error(error); return; }
            toast.success('Added'); setName(''); setPct(0); window.location.reload();
        });
    };

    const handleDelete = async (id: string, pn: string) => {
        if (!confirm(`Remove "${pn}"?`)) return;
        startTransition(async () => {
            const { error } = await deleteProfitSplit(id);
            if (error) { toast.error(error); return; }
            setSplits(prev => prev.filter(s => s.id !== id)); toast.success('Removed');
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-0.5">Revenue distribution</p>
            <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-5">Profit Split</h1>

            {/* Allocation */}
            <div className="bg-card border border-bdr rounded-2xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold">Allocation</h3>
                    <span className={`text-sm font-bold ${totalPct === 100 ? 'text-ok' : 'text-warn'}`}>{totalPct}%</span>
                </div>
                <div className="w-full bg-card-hi rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min(totalPct, 100)}%`,
                        background: totalPct === 100 ? '#4ade80' : totalPct > 100 ? '#f87171' : '#c8ff00',
                    }} />
                </div>
                {totalPct !== 100 && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <AlertCircle size={11} className="text-warn" />
                        <span className="text-[11px] text-warn">Should total 100%</span>
                    </div>
                )}
            </div>

            {/* Partners */}
            <div className="space-y-2 mb-4">
                {splits.map(s => {
                    const amount = (todayProfit * Number(s.percentage)) / 100;
                    return (
                        <div key={s.id} className="bg-card border border-bdr rounded-2xl p-3.5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 bg-lime/8 text-lime">
                                {s.person_name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{s.person_name}</p>
                                <p className="text-[11px] text-t3">{s.percentage}% → <span className="text-lime">{formatCurrency(amount)} today</span></p>
                            </div>
                            <button onClick={() => handleDelete(s.id, s.person_name)}
                                className="p-1.5 rounded-lg bg-err/8 text-err hover:bg-err/15 transition-colors">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Add */}
            <div className="bg-card border border-bdr rounded-2xl p-4">
                <h3 className="font-semibold text-sm mb-3">Add Partner</h3>
                <div className="flex flex-col sm:flex-row gap-2.5">
                    <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-deep border border-bdr rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors" />
                    <div className="flex gap-2">
                        <input type="number" placeholder="%" value={pct || ''} min={1} max={100}
                            onChange={(e) => setPct(+e.target.value)}
                            className="w-20 bg-deep border border-bdr rounded-xl px-3 py-2.5 text-sm outline-none focus:border-lime/40 transition-colors" />
                        <button onClick={handleAdd} disabled={isPending}
                            className="flex items-center gap-1.5 bg-lime text-deep font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40">
                            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
