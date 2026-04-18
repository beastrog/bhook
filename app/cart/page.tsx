'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';

function emoji(c: string) {
    return ({ Chips: '🍟', Noodles: '🍜', Chocolates: '🍫', Drinks: '🥤', Biscuits: '🍪' } as any)[c] ?? '🍿';
}

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const total = getTotal();

    if (items.length === 0) {
        return (
            <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[65vh] px-5">
                    <p className="text-5xl mb-5">🛒</p>
                    <p className="font-bold text-lg mb-1.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Cart is empty</p>
                    <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Add some snacks from the menu</p>
                    <Link href="/menu" className="btn btn-orange-pill">Browse Menu →</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh pb-36" style={{ background: 'var(--bg)' }}>
            <Navbar />
            <div className="max-w-lg mx-auto px-5 pt-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/menu" className="btn btn-icon">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="font-black text-xl" style={{ letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Cart</h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{items.length} item type{items.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-5">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.product.id}
                                layout
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 12, height: 0 }}
                                className="card flex items-center gap-3 p-3"
                                style={{ borderRadius: '14px' }}
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: 'var(--bg-2)' }}>
                                    {emoji(item.product.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.product.name}</p>
                                    <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                                        {formatCurrency(item.product.selling_price * item.quantity)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                                        <Minus size={11} />
                                    </button>
                                    <span className="text-sm font-bold w-4 text-center" style={{ color: 'var(--text-primary)' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock_quantity}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
                                        style={{ background: 'var(--accent)', color: '#fff' }}>
                                        <Plus size={11} />
                                    </button>
                                    <button onClick={() => removeItem(item.product.id)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center ml-0.5"
                                        style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="card p-4 mb-4" style={{ borderRadius: '14px' }}>
                    <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>Order Summary</p>
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm">
                                <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} × {item.quantity}</span>
                                <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(item.product.selling_price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="sep my-3" />
                    <div className="flex justify-between">
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Total</span>
                        <span className="font-black text-base" style={{ color: 'var(--accent)' }}>{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Offline notice */}
                <div className="p-3 rounded-xl text-center text-xs mb-4" style={{ background: 'var(--bg-1)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                    💵 Pay <strong style={{ color: 'var(--text-secondary)' }}>{formatCurrency(total)} cash</strong> at pickup · No online payment
                </div>
            </div>

            {/* Fixed bottom */}
            <div className="fixed bottom-0 left-0 right-0 pb-safe px-5 py-4"
                style={{ background: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}>
                <Link href="/checkout" className="btn btn-orange-pill w-full flex justify-center py-4">
                    Reserve · {formatCurrency(total)} →
                </Link>
            </div>
        </div>
    );
}
