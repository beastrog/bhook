'use client';

import { formatCurrency, formatDateShort } from '@/lib/utils';

interface Order { created_at: string; total_amount: number; total_profit: number; }

export default function AnalyticsClient({ orders, splits }: { orders: Order[]; splits: any[] }) {
    const byDay: Record<string, { revenue: number; profit: number; count: number }> = {};
    orders.forEach(o => {
        const day = o.created_at.slice(0, 10);
        if (!byDay[day]) byDay[day] = { revenue: 0, profit: 0, count: 0 };
        byDay[day].revenue += Number(o.total_amount);
        byDay[day].profit += Number(o.total_profit);
        byDay[day].count += 1;
    });

    const days = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);
    const totalProfit = orders.reduce((s, o) => s + Number(o.total_profit), 0);
    const maxProfit = Math.max(...days.map(d => d[1].profit), 1);

    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-0.5">Performance</p>
            <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-5">Analytics</h1>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
                <div className="bg-card border border-bdr rounded-2xl p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-1">Revenue</p>
                    <p className="font-display font-bold text-xl text-lime">{formatCurrency(totalRevenue)}</p>
                    <p className="text-[11px] text-t3">{orders.length} orders</p>
                </div>
                <div className="bg-card border border-bdr rounded-2xl p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-1">Profit</p>
                    <p className="font-display font-bold text-xl text-ok">{formatCurrency(totalProfit)}</p>
                    <p className="text-[11px] text-t3">{totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}% margin</p>
                </div>
                <div className="bg-card border border-bdr rounded-2xl p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-1">Avg Order</p>
                    <p className="font-display font-bold text-xl">{orders.length > 0 ? formatCurrency(totalRevenue / orders.length) : '₹0'}</p>
                </div>
                <div className="bg-card border border-bdr rounded-2xl p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-1">Avg Profit</p>
                    <p className="font-display font-bold text-xl text-ok">{orders.length > 0 ? formatCurrency(totalProfit / orders.length) : '₹0'}</p>
                </div>
            </div>

            {/* Chart */}
            {days.length > 0 ? (
                <div className="bg-card border border-bdr rounded-2xl p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">Profit Trend</h3>
                        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3">Last 14 days</span>
                    </div>
                    <div className="flex items-end gap-[3px] h-28 sm:h-36">
                        {days.map(([day, data], i) => {
                            const isLast = i === days.length - 1;
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                                    <div className="w-full rounded-t transition-all"
                                        style={{
                                            height: `${Math.max(8, (data.profit / maxProfit) * 100)}%`,
                                            background: isLast ? '#c8ff00' : '#1e1e1c',
                                            minHeight: 4, borderRadius: '4px 4px 0 0',
                                        }}
                                        title={`${day}: ${formatCurrency(data.profit)}`} />
                                    <span className={`text-[7px] sm:text-[8px] font-semibold ${isLast ? 'text-lime' : 'text-t3'}`}>
                                        {formatDateShort(day)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-card border border-bdr rounded-2xl p-8 text-center mb-5">
                    <p className="text-3xl mb-2">📊</p>
                    <p className="text-sm text-t3">No completed orders yet</p>
                </div>
            )}

            {/* Cumulative Split */}
            {splits.length > 0 && totalProfit > 0 && (
                <div className="bg-card border border-bdr rounded-2xl p-4">
                    <h3 className="font-semibold text-sm mb-3">Cum. Profit Split</h3>
                    <div className="space-y-3">
                        {splits.map(s => {
                            const amount = (totalProfit * s.percentage) / 100;
                            return (
                                <div key={s.id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-semibold">{s.person_name}</span>
                                        <div>
                                            <span className="font-bold text-sm text-lime">{formatCurrency(amount)}</span>
                                            <span className="text-[11px] text-t3 ml-1">({s.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-card-hi rounded-full h-1.5">
                                        <div className="h-1.5 rounded-full bg-lime" style={{ width: `${s.percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
