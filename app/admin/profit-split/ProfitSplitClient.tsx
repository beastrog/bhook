'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { ProfitSplit } from '@/lib/types';
import { upsertProfitSplit, deleteProfitSplit, upsertCookedProfitSplit, deleteCookedProfitSplit } from '@/app/admin/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfitSplitClient({
    splits: initSplits, todayProfit, allTimeProfit,
    cookedSplits: initCookedSplits, cookedTodayProfit, cookedAllTimeProfit
}: {
    splits: ProfitSplit[]; todayProfit: number; allTimeProfit: number;
    cookedSplits: ProfitSplit[]; cookedTodayProfit: number; cookedAllTimeProfit: number;
}) {
    const [splits, setSplits] = useState(initSplits);
    const [cookedSplits, setCookedSplits] = useState(initCookedSplits);

    const [name, setName] = useState('');
    const [pct, setPct] = useState<number>(0);

    const [cName, setCName] = useState('');
    const [cPct, setCPct] = useState<number>(0);

    const [isPending, startTransition] = useTransition();

    const totalPct = splits.reduce((s, p) => s + Number(p.percentage), 0);
    const totalCPct = cookedSplits.reduce((s, p) => s + Number(p.percentage), 0);

    const handleAdd = async (type: 'general' | 'cooked') => {
        const n = type === 'general' ? name : cName;
        const p = type === 'general' ? pct : cPct;
        const tot = type === 'general' ? totalPct : totalCPct;

        if (!n.trim()) { toast.error('Name required'); return; }
        if (p <= 0 || p > 100) { toast.error('1-100%'); return; }
        if (tot + p > 100) { toast.error('Exceeds 100%'); return; }

        startTransition(async () => {
            const splitData = { person_name: n, percentage: p, active: true };
            const { error } = type === 'general' ? await upsertProfitSplit(splitData) : await upsertCookedProfitSplit(splitData);
            if (error) { toast.error(error); return; }
            toast.success('Added');
            if (type === 'general') { setName(''); setPct(0); } else { setCName(''); setCPct(0); }
            window.location.reload();
        });
    };

    const handleDelete = async (id: string, pn: string, type: 'general' | 'cooked') => {
        if (!confirm(`Remove "${pn}"?`)) return;
        startTransition(async () => {
            const { error } = type === 'general' ? await deleteProfitSplit(id) : await deleteCookedProfitSplit(id);
            if (error) { toast.error(error); return; }
            if (type === 'general') {
                setSplits(prev => prev.filter(s => s.id !== id));
            } else {
                setCookedSplits(prev => prev.filter(s => s.id !== id));
            }
            toast.success('Removed');
        });
    };

    const SplitSection = ({ title, splitsList, todayAmt, allTimeAmt, tot, n, p, setN, setP, type, color, bg }: any) => (
        <div className="mb-10 last:mb-0">
            <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-2 rounded-full h-5" style={{ background: color }}></span>
                {title} <span className="font-normal text-sm text-t3 ml-2">(Today: {formatCurrency(todayAmt)} | All-time: {formatCurrency(allTimeAmt)})</span>
            </h2>

            {/* Allocation */}
            <div className="bg-card border border-bdr rounded-2xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold">Allocation</h3>
                    <span className={`text-sm font-bold ${tot === 100 ? 'text-ok' : 'text-warn'}`}>{tot}%</span>
                </div>
                <div className="w-full bg-card-hi rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{
                        width: `${Math.min(tot, 100)}%`,
                        background: tot === 100 ? '#4ade80' : tot > 100 ? '#f87171' : color,
                    }} />
                </div>
                {tot !== 100 && (
                    <div className="flex items-center gap-1.5 mt-2">
                        <AlertCircle size={11} className="text-warn" />
                        <span className="text-[11px] text-warn">Should total 100%</span>
                    </div>
                )}
            </div>

            {/* Partners */}
            <div className="space-y-2 mb-4">
                {splitsList.map((s: ProfitSplit) => {
                    const dailySplitAmt = (todayAmt * Number(s.percentage)) / 100;
                    const allTimeSplitAmt = (allTimeAmt * Number(s.percentage)) / 100;
                    return (
                        <div key={s.id} className="bg-card border border-bdr rounded-2xl p-3.5 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: bg, color: color }}>
                                {s.person_name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{s.person_name}</p>
                                <p className="text-[11px] text-t3">{s.percentage}%</p>
                                <div className="flex gap-3 mt-0.5 flex-wrap">
                                    <span className="text-[11px] text-warn">Today: <span className="font-bold text-t1">{formatCurrency(dailySplitAmt)}</span></span>
                                    <span className="text-[11px] text-t3">All-time: <span className="font-bold" style={{ color: color }}>{formatCurrency(allTimeSplitAmt)}</span></span>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(s.id, s.person_name, type)}
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
                    <input placeholder="Name" value={n} onChange={(e) => setN(e.target.value)}
                        className="flex-1 bg-deep border border-bdr rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-t3 focus:border-[{color}]/40 transition-colors" />
                    <div className="flex gap-2">
                        <input type="number" placeholder="%" value={p || ''} min={1} max={100}
                            onChange={(e) => setP(+e.target.value)}
                            className="w-20 bg-deep border border-bdr rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[{color}]/40 transition-colors" />
                        <button onClick={() => handleAdd(type)} disabled={isPending}
                            className="flex items-center gap-1.5 text-[#000000] font-bold px-5 py-2.5 rounded-xl hover:shadow-lg transition-all active:scale-[0.97] disabled:opacity-40"
                            style={{ background: color }}>
                            {isPending ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />} Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-0.5">Revenue distribution</p>
            <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-8">Profit Split</h1>

            <SplitSection
                title="General Snacks"
                splitsList={splits}
                todayAmt={todayProfit}
                allTimeAmt={allTimeProfit}
                tot={totalPct}
                n={name} p={pct} setN={setName} setP={setPct}
                type="general" color="#c8ff00" bg="rgba(200,255,0,0.08)"
            />

            <div className="w-full h-px bg-bdr my-5" />

            <SplitSection
                title="Cooked Items (Maggi)"
                splitsList={cookedSplits}
                todayAmt={cookedTodayProfit}
                allTimeAmt={cookedAllTimeProfit}
                tot={totalCPct}
                n={cName} p={cPct} setN={setCName} setP={setCPct}
                type="cooked" color="#fb923c" bg="rgba(251,146,60,0.08)"
            />
        </div>
    );
}
