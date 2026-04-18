'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronDown, Eye } from 'lucide-react';
import { Order } from '@/lib/types';
import { updateOrderStatus } from '@/app/admin/actions';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function OrdersClient({ initialOrders, defaultDate }: { initialOrders: Order[]; defaultDate?: string }) {
    const router = useRouter();
    const [orders, setOrders] = useState(initialOrders);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [dateFilter, setDateFilter] = useState(defaultDate || '');

    const applyDateFilter = (d: string) => {
        setDateFilter(d);
        const params = d ? `?date=${d}` : '';
        router.push(`/admin/orders${params}`);
    };

    const handleStatus = async (id: string, status: string) => {
        startTransition(async () => {
            const { error } = await updateOrderStatus(id, status);
            if (error) { toast.error(error); return; }
            setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: status as any } : o));
            toast.success(`Order marked as ${getStatusLabel(status)}`);
        });
    };

    return (
        <div className="px-5 pt-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-black" style={{ color: 'var(--on-surface)' }}>Orders</h1>
                    <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>{orders.length} orders</p>
                </div>
            </div>

            {/* Date filter */}
            <div className="mb-4">
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => applyDateFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg-card)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)', colorScheme: 'dark' }}
                />
                {dateFilter && (
                    <button onClick={() => applyDateFilter('')} className="ml-2 text-xs px-3 py-2 rounded-xl"
                        style={{ background: 'var(--bg-card)', color: 'var(--on-surface-muted)' }}>
                        Clear
                    </button>
                )}
            </div>

            {/* Orders list */}
            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-3">📋</div>
                    <p style={{ color: 'var(--on-surface-muted)' }}>No orders found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => (
                        <motion.div key={order.id} layout className="glass rounded-2xl overflow-hidden">
                            {/* Order header */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-sm" style={{ color: 'var(--primary)' }}>{order.order_number}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-sm" style={{ color: 'var(--on-surface)' }}>{order.customer_name}</p>
                                        <p className="text-xs" style={{ color: 'var(--on-surface-muted)' }}>Room {order.room_number} · {formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-black" style={{ color: 'var(--secondary)' }}>{formatCurrency(order.total_amount)}</p>
                                        <p className="text-xs" style={{ color: '#5bf083' }}>+{formatCurrency(order.total_profit)} profit</p>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded view */}
                            <AnimatePresence>
                                {expanded === order.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ borderTop: '1px solid rgba(69,72,82,0.2)' }}
                                    >
                                        <div className="p-4">
                                            {/* Items */}
                                            {(order as any).order_items?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm mb-1.5">
                                                    <span style={{ color: 'var(--on-surface-muted)' }}>{item.product_name} × {item.quantity}</span>
                                                    <span style={{ color: 'var(--on-surface)' }}>{formatCurrency(item.line_total)}</span>
                                                </div>
                                            ))}

                                            {order.phone_number && (
                                                <p className="text-xs mt-2" style={{ color: 'var(--on-surface-muted)' }}>📱 {order.phone_number}</p>
                                            )}

                                            {/* Action buttons */}
                                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => handleStatus(order.id, 'completed')}
                                                        disabled={isPending}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold"
                                                        style={{ background: 'rgba(91,240,131,0.15)', color: '#5bf083' }}
                                                    >
                                                        <Check size={14} /> Complete
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(order.id, 'cancelled')}
                                                        disabled={isPending}
                                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold"
                                                        style={{ background: 'rgba(255,110,132,0.1)', color: '#ff6e84' }}
                                                    >
                                                        <X size={14} /> Cancel
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
