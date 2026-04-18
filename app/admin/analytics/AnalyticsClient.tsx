'use client';

import { formatCurrency, formatDateShort } from '@/lib/utils';

interface Order { created_at: string; total_amount: number; total_profit: number; }

export default function AnalyticsClient({ orders, splits }: { orders: Order[]; splits: any[] }) {
    // Group by day
    const byDay: Record<string, { revenue: number; profit: number; count: number }> = {};
    orders.forEach((o) => {
        const day = o.created_at.slice(0, 10);
        if (!byDay[day]) byDay[day] = { revenue: 0, profit: 0, count: 0 };
        byDay[day].revenue += Number(o.total_amount);
        byDay[day].profit += Number(o.total_profit);
        byDay[day].count += 1;
    });

    const days = Object.entries(byDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-14);
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount), 0);
    const totalProfit = orders.reduce((s, o) => s + Number(o.total_profit), 0);
    const maxProfit = Math.max(...days.map((d) => d[1].profit), 1);

    return (
        <div className="px-5 pt-5">
            <h1 className="text-xl font-black mb-1" style={{ color: 'var(--on-surface)' }}>Analytics</h1>
            <p className="text-sm mb-5" style={{ color: 'var(--on-surface-muted)' }}>Last 30 days (completed orders)</p>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass rounded-2xl p-4">
                    <p className="text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>Total Revenue</p>
                    <p className="text-xl font-black" style={{ color: 'var(--secondary)' }}>{formatCurrency(totalRevenue)}</p>
                    <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>{orders.length} orders</p>
                </div>
                <div className="glass rounded-2xl p-4">
                    <p className="text-xs mb-1" style={{ color: 'var(--on-surface-muted)' }}>Total Profit</p>
                    <p className="text-xl font-black" style={{ color: '#5bf083' }}>{formatCurrency(totalProfit)}</p>
                    <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>
                        {totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}% margin
                    </p>
                </div>
            </div>

            {/* Bar chart */}
            {days.length > 0 ? (
                <div className="glass rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--on-surface)' }}>Daily Profit (last 14 days)</h3>
                    <div className="flex items-end gap-1 h-28">
                        {days.map(([day, data]) => (
                            <div key={day} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                    className="w-full rounded-t-sm transition-all"
                                    style={{
                                        height: `${Math.max(8, (data.profit / maxProfit) * 100)}%`,
                                        background: 'linear-gradient(180deg, #ba9eff, #8455ef)',
                                        minHeight: '4px',
                                    }}
                                    title={`${day}: ${formatCurrency(data.profit)}`}
                                />
                                <span className="text-[8px]" style={{ color: 'var(--on-surface-muted)' }}>
                                    {formatDateShort(day)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass rounded-2xl p-8 text-center mb-6">
                    <p className="text-3xl mb-2">📊</p>
                    <p style={{ color: 'var(--on-surface-muted)' }}>No completed orders yet</p>
                </div>
            )}

            {/* Profit split for total */}
            {splits.length > 0 && totalProfit > 0 && (
                <div className="glass rounded-2xl p-4">
                    <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--on-surface)' }}>
                        Cumulative Profit Split
                    </h3>
                    <div className="space-y-3">
                        {splits.map((s) => {
                            const amount = (totalProfit * s.percentage) / 100;
                            return (
                                <div key={s.id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>{s.person_name}</span>
                                        <div>
                                            <span className="font-black text-sm" style={{ color: 'var(--secondary)' }}>{formatCurrency(amount)}</span>
                                            <span className="text-xs ml-1" style={{ color: 'var(--on-surface-muted)' }}>({s.percentage}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full rounded-full h-1.5" style={{ background: 'var(--bg-card-high)' }}>
                                        <div className="h-1.5 rounded-full" style={{ width: `${s.percentage}%`, background: 'linear-gradient(90deg, #ba9eff, #8455ef)' }} />
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
