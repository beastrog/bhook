'use client';

import { formatCurrency } from '@/lib/utils';
import { adminLogout } from '@/app/admin/actions';
import Link from 'next/link';
import { LogOut, AlertTriangle, RefreshCw, TrendingUp, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function Stat({ label, value, color, note }: { label: string; value: string; color: string; note?: string }) {
    return (
        <div className="bg-card border border-bdr rounded-2xl p-4">
            <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-1.5">{label}</p>
            <p className="font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color }}>{value}</p>
            {note && <p className="text-[11px] text-t3 mt-0.5">{note}</p>}
        </div>
    );
}

export default function DashboardClient({ stats, splits }: { stats: any; splits: any[] }) {
    // Defer date to client only — server renders UTC, client is IST → text mismatch = React #418
    const [today, setToday] = useState('');
    useEffect(() => {
        setToday(new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
    }, []);
    const totalPct = splits.reduce((s: number, p: any) => s + Number(p.percentage), 0);
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel('dashboard-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => {
                    console.log('Dashboard update triggered by order change');
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router]);


    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-1">Real-time telemetry</p>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">DASHBOARD</h1>
                    <p className="text-[11px] text-t3 mt-0.5">{today}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} title="Refresh"
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-bdr text-t2 hover:bg-card-hi transition-colors">
                        <RefreshCw size={14} />
                    </button>
                    <button onClick={() => adminLogout()} title="Logout"
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-card border border-bdr text-err hover:bg-err/10 transition-colors">
                        <LogOut size={14} />
                    </button>
                </div>
            </div>

            {/* All-Time Stats */}
            <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} className="text-lime" />
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-lime">All-Time Totals</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
                <Stat label="Revenue" value={formatCurrency(stats.totalRevenue)} color="#c8ff00" note={`${stats.totalOrders} completed`} />
                <Stat label="Net Profit" value={formatCurrency(stats.totalProfit)} color="#4ade80" note="After cost" />
                <Stat label="Total Cost" value={formatCurrency(stats.totalCost)} color="#a78bfa" note="Stock cost" />
                <Stat label="All Orders" value={String(stats.totalOrders)} color="#f0f0e8" note="Completed ever" />
            </div>

            {/* Daily Stats */}
            <div className="flex items-center gap-2 mb-3">
                <Calendar size={13} className="text-warn" />
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-warn">Today</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
                <Stat label="Today Revenue" value={formatCurrency(stats.dailyRevenue)} color="#c8ff00" note="Completed today" />
                <Stat label="Today Profit" value={formatCurrency(stats.dailyProfit)} color="#4ade80" note="After cost" />
                <Stat label="Today Orders" value={String(stats.dailyOrders)} color="#f0f0e8" note="All statuses" />
                <Stat label="Pending" value={String(stats.pendingOrders)} color="#fbbf24" note="Need action" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
                {/* Order breakdown */}
                {stats.dailyOrders > 0 && (
                    <div className="bg-card border border-bdr rounded-2xl p-4">
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-3">Today's order breakdown</p>
                        <div className="flex rounded-lg overflow-hidden h-2 mb-3 gap-0.5">
                            {stats.dailyCompleted > 0 && <div style={{ flex: stats.dailyCompleted, background: '#4ade80', minWidth: 4, borderRadius: 4 }} />}
                            {stats.pendingOrders > 0 && <div style={{ flex: stats.pendingOrders, background: '#fbbf24', minWidth: 4, borderRadius: 4 }} />}
                            {stats.dailyCancelled > 0 && <div style={{ flex: stats.dailyCancelled, background: '#f87171', minWidth: 4, borderRadius: 4 }} />}
                        </div>
                        <div className="flex gap-4 text-[11px] text-t2">
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-ok" />{stats.dailyCompleted} done</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warn" />{stats.pendingOrders} pending</span>
                            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-err" />{stats.dailyCancelled} cancelled</span>
                        </div>
                    </div>
                )}

                {/* Top sellers - all time */}
                {stats.bestSellers?.length > 0 && (
                    <div className="bg-card border border-bdr rounded-2xl p-4">
                        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-3">Top Sellers (All Time)</p>
                        <div className="space-y-2.5">
                            {stats.bestSellers.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className={`text-xs font-black w-5 text-center ${i === 0 ? 'text-lime' : 'text-t3'}`}>{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{item.name}</p>
                                        <p className="text-[11px] text-t3">{item.qty} units</p>
                                    </div>
                                    <span className="text-sm font-bold text-lime">{formatCurrency(item.revenue)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Low stock */}
            {stats.lowStockProducts?.length > 0 && (
                <div className="rounded-2xl p-4 mb-4 bg-err/5 border border-err/12">
                    <p className="text-[11px] font-bold flex items-center gap-1.5 text-err mb-2">
                        <AlertTriangle size={13} /> Low Stock ({stats.lowStockProducts.length})
                    </p>
                    <div className="space-y-1.5">
                        {stats.lowStockProducts.slice(0, 5).map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between">
                                <span className="text-xs text-t2">{p.name}</span>
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${p.stock_quantity === 0 ? 'bg-err/10 text-err' : 'bg-warn/10 text-warn'}`}>
                                    {p.stock_quantity === 0 ? 'Out' : p.stock_quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Profit split - All Time */}
            {splits.length > 0 && stats.totalProfit > 0 && (
                <div className="bg-card border border-bdr rounded-2xl p-4 mb-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-1">Profit split</p>
                    <p className="text-[10px] text-t3 mb-3">Based on all-time profits</p>
                    <div className="space-y-2.5">
                        {splits.map((s: any) => {
                            const amt = (stats.totalProfit * s.percentage) / 100;
                            return (
                                <div key={s.id} className="flex items-center justify-between">
                                    <div><p className="text-sm font-semibold">{s.person_name}</p><p className="text-[11px] text-t3">{s.percentage}%</p></div>
                                    <p className="font-bold text-sm text-lime">{formatCurrency(amt)}</p>
                                </div>
                            );
                        })}
                    </div>
                    {totalPct !== 100 && <p className="text-xs text-warn mt-2">⚠ Splits total {totalPct}% (should be 100%)</p>}
                </div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2.5">
                <Link href="/admin/orders" className="bg-card border border-bdr rounded-2xl p-4 hover:border-bdr-hi hover:-translate-y-0.5 transition-all">
                    <p className="font-display font-bold text-3xl tracking-tight text-warn">{stats.pendingOrders}</p>
                    <p className="text-[11px] text-t3 mt-0.5">Pending orders</p>
                </Link>
                <Link href="/admin/products" className="bg-card border border-bdr rounded-2xl p-4 hover:border-bdr-hi hover:-translate-y-0.5 transition-all">
                    <p className="font-display font-bold text-3xl tracking-tight text-err">{stats.lowStockProducts?.length ?? 0}</p>
                    <p className="text-[11px] text-t3 mt-0.5">Low stock items</p>
                </Link>
            </div>
        </div>
    );
}
