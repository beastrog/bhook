'use client';

import { formatCurrency } from '@/lib/utils';
import { adminLogout } from '@/app/admin/actions';
import Link from 'next/link';
import { LogOut, TrendingUp, ShoppingBag, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

function Tile({ label, value, color, note }: { label: string; value: string; color: string; note?: string }) {
    return (
        <div className="card p-4" style={{ borderRadius: '14px' }}>
            <p className="text-label mb-2">{label}</p>
            <p className="font-black text-2xl" style={{ color, letterSpacing: '-0.03em' }}>{value}</p>
            {note && <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{note}</p>}
        </div>
    );
}

export default function DashboardClient({ stats, splits }: { stats: any; splits: any[] }) {
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const totalPct = splits.reduce((s: number, p: any) => s + Number(p.percentage), 0);

    return (
        <div className="max-w-lg mx-auto px-5 pt-5 pb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="font-black text-2xl" style={{ letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Dashboard</h1>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{today}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.location.reload()} className="btn btn-icon" title="Refresh">
                        <RefreshCw size={15} />
                    </button>
                    <button onClick={() => adminLogout()} className="btn btn-icon" title="Logout"
                        style={{ color: 'var(--red)', borderColor: 'var(--red-bg)' }}>
                        <LogOut size={15} />
                    </button>
                </div>
            </div>

            {/* Stat tiles */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <Tile label="Revenue today" value={formatCurrency(stats.totalRevenue)} color="var(--accent)" note="Completed orders" />
                <Tile label="Profit today" value={formatCurrency(stats.totalProfit)} color="var(--green)" note="After cost" />
                <Tile label="Total orders" value={String(stats.totalOrders)} color="var(--text-primary)" note="Today" />
                <Tile label="Pending" value={String(stats.pendingOrders)} color="var(--amber)" note="Need action" />
            </div>

            {/* Order status bar */}
            {stats.totalOrders > 0 && (
                <div className="card p-4 mb-4" style={{ borderRadius: '14px' }}>
                    <p className="text-label mb-3">Order breakdown</p>
                    <div className="flex rounded-lg overflow-hidden h-2 mb-3 gap-0.5">
                        {stats.completedOrders > 0 && <div style={{ flex: stats.completedOrders, background: 'var(--green)', minWidth: 4 }} />}
                        {stats.pendingOrders > 0 && <div style={{ flex: stats.pendingOrders, background: 'var(--amber)', minWidth: 4 }} />}
                        {stats.cancelledOrders > 0 && <div style={{ flex: stats.cancelledOrders, background: 'var(--red)', minWidth: 4 }} />}
                    </div>
                    <div className="flex gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--green)' }} />{stats.completedOrders} done</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--amber)' }} />{stats.pendingOrders} pending</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--red)' }} />{stats.cancelledOrders} cancelled</span>
                    </div>
                </div>
            )}

            {/* Best sellers */}
            {stats.bestSellers?.length > 0 && (
                <div className="card p-4 mb-4" style={{ borderRadius: '14px' }}>
                    <p className="text-label mb-3">Best sellers today</p>
                    <div className="space-y-2.5">
                        {stats.bestSellers.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-black w-5 text-center" style={{ color: i === 0 ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                                    {i + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{item.qty} units</p>
                                </div>
                                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{formatCurrency(item.revenue)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Low stock */}
            {stats.lowStockProducts?.length > 0 && (
                <div className="p-4 mb-4 rounded-2xl" style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-xs font-bold flex items-center gap-1.5 mb-3" style={{ color: 'var(--red)' }}>
                        <AlertTriangle size={13} /> Low stock ({stats.lowStockProducts.length})
                    </p>
                    <div className="space-y-1.5">
                        {stats.lowStockProducts.slice(0, 5).map((p: any) => (
                            <div key={p.id} className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
                                <span className="badge badge-red">{p.stock_quantity === 0 ? 'Out' : `${p.stock_quantity}`}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Profit split */}
            {splits.length > 0 && stats.totalProfit > 0 && (
                <div className="card p-4 mb-4" style={{ borderRadius: '14px' }}>
                    <p className="text-label mb-3">Profit split today</p>
                    <div className="space-y-3">
                        {splits.map((s: any) => {
                            const amt = (stats.totalProfit * s.percentage) / 100;
                            return (
                                <div key={s.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.person_name}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{s.percentage}%</p>
                                    </div>
                                    <p className="font-bold text-sm" style={{ color: 'var(--accent)' }}>{formatCurrency(amt)}</p>
                                </div>
                            );
                        })}
                    </div>
                    {totalPct !== 100 && (
                        <p className="text-xs mt-3" style={{ color: 'var(--amber)' }}>⚠ Splits total {totalPct}% (should be 100%)</p>
                    )}
                </div>
            )}

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/orders" className="card p-4 hover-lift" style={{ borderRadius: '14px' }}>
                    <p className="font-black text-2xl" style={{ color: 'var(--amber)', letterSpacing: '-0.03em' }}>{stats.pendingOrders}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Pending orders</p>
                </Link>
                <Link href="/admin/products" className="card p-4 hover-lift" style={{ borderRadius: '14px' }}>
                    <p className="font-black text-2xl" style={{ color: 'var(--red)', letterSpacing: '-0.03em' }}>{stats.lowStockProducts?.length ?? 0}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Low stock items</p>
                </Link>
            </div>
        </div>
    );
}
