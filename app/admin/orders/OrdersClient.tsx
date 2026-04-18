'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Order } from '@/lib/types';
import { updateOrderStatus } from '@/app/admin/actions';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const STATUS_TABS = ['all', 'reserved', 'completed', 'cancelled'] as const;

export default function OrdersClient({ initialOrders, defaultDate }: { initialOrders: Order[]; defaultDate?: string }) {
    const router = useRouter();
    const [orders, setOrders] = useState(initialOrders);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [dateFilter, setDateFilter] = useState(defaultDate || '');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const applyDate = (d: string) => { setDateFilter(d); router.push(`/admin/orders${d ? `?date=${d}` : ''}`); };

    const handleStatus = async (id: string, status: string) => {
        startTransition(async () => {
            const { error } = await updateOrderStatus(id, status);
            if (error) { toast.error(error); return; }
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o));
            toast.success(`Marked as ${getStatusLabel(status)}`);
        });
    };

    const visible = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-0.5">Management</p>
                    <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight">Orders</h1>
                    <p className="text-[11px] text-t3">{orders.length} total</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
                <input type="date" value={dateFilter} onChange={(e) => applyDate(e.target.value)}
                    className="bg-card border border-bdr rounded-xl px-3 py-2 text-sm outline-none focus:border-lime/40 transition-colors max-w-[180px]"
                    style={{ colorScheme: 'dark' }} />
                <div className="flex gap-1.5">
                    {STATUS_TABS.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold capitalize border transition-all ${statusFilter === s ? 'bg-lime text-[#000000] border-lime' : 'text-t3 border-bdr hover:border-bdr-hi'
                                }`}>{s}</button>
                    ))}
                </div>
                {dateFilter && <button onClick={() => applyDate('')} className="text-xs text-t3 hover:text-t2 transition-colors">Clear date</button>}
            </div>

            {visible.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-sm text-t3">No orders found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                    {visible.map(order => (
                        <motion.div key={order.id} layout className="bg-card border border-bdr rounded-2xl overflow-hidden">
                            <div className="p-3.5 cursor-pointer hover:bg-card-hi/50 transition-colors"
                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-bold text-sm text-lime">{order.order_number}</span>
                                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-sm">{order.customer_name}</p>
                                        <p className="text-[11px] text-t3">Room {order.room_number} · {formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-lime">{formatCurrency(order.total_amount)}</p>
                                        <p className="text-[11px] text-ok">+{formatCurrency(order.total_profit)}</p>
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {expanded === order.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-bdr">
                                        <div className="p-3.5">
                                            {(order as any).order_items?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm mb-1">
                                                    <span className="text-t2">{item.product_name} × {item.quantity}</span>
                                                    <span>{formatCurrency(item.line_total)}</span>
                                                </div>
                                            ))}
                                            {order.phone_number && <p className="text-[11px] text-t3 mt-2">📱 {order.phone_number}</p>}
                                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <div className="flex gap-2 mt-3">
                                                    <button onClick={() => handleStatus(order.id, 'completed')} disabled={isPending}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold bg-ok/10 text-ok hover:bg-ok/15 transition-colors disabled:opacity-40">
                                                        <Check size={13} /> Done
                                                    </button>
                                                    <button onClick={() => handleStatus(order.id, 'cancelled')} disabled={isPending}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold bg-err/8 text-err hover:bg-err/15 transition-colors disabled:opacity-40">
                                                        <X size={13} /> Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
