'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X } from 'lucide-react';
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
            <div className="min-h-dvh bg-black">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
                    <p className="text-overline mb-4 opacity-50">Cart</p>
                    <p className="title-medium mb-8 text-center" style={{ color: 'var(--text-secondary)' }}>You haven't added<br />anything yet.</p>
                    <Link href="/menu" className="btn btn-secondary uppercase" style={{ fontSize: '13px', letterSpacing: '0.05em' }}>
                        Return to Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-black pb-40">
            <Navbar />
            <div className="max-w-4xl mx-auto px-8 md:px-16 pt-16 md:pt-32">

                <h1 className="title-medium mb-2">Cart.</h1>
                <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>{items.length} items</p>

                {/* Minimal Item List */}
                <div className="flex flex-col border-t border-[var(--border-subtle)]">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.product.id}
                                layout
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                                className="py-5 border-b border-[var(--border-subtle)] flex items-center gap-4"
                            >
                                <div className="text-3xl p-2 bg-[var(--bg-2)] rounded-xl flex-shrink-0">
                                    {emoji(item.product.category)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-lg leading-tight truncate mb-1">{item.product.name}</p>
                                    <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                        {formatCurrency(item.product.selling_price * item.quantity)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <button onClick={() => removeItem(item.product.id)} className="text-[var(--text-tertiary)] hover:text-white transition-colors">
                                        <X size={18} />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="btn-icon w-7 h-7">
                                            <Minus size={12} />
                                        </button>
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock_quantity}
                                            className="btn-icon w-7 h-7 disabled:opacity-30 disabled:bg-transparent"
                                            style={item.quantity < item.product.stock_quantity ? { background: 'white', color: 'black', border: 'none' } : {}}
                                        >
                                            <Plus size={12} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Clean Summary */}
                <div className="mt-10">
                    <div className="flex justify-between items-end">
                        <span className="text-overline">Total due at pickup</span>
                        <span className="title-medium" style={{ fontSize: '32px' }}>{formatCurrency(total)}</span>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-[var(--bg-1)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)]">
                        Payment is <strong>cash only</strong>. Hand it to the admin when collecting your order.
                    </div>
                </div>

            </div>

            {/* Floating Checkout Bar */}
            <div className="fixed bottom-6 left-6 right-6 z-50 max-w-xl mx-auto">
                <Link href="/checkout" className="btn btn-accent w-full flex justify-between shadow-[0_0_40px_rgba(226,254,83,0.15)] tracking-tight">
                    <span>Checkout</span>
                    <span className="font-black bg-black text-[var(--accent)] px-3 py-1 rounded-full text-sm">
                        {formatCurrency(total)}
                    </span>
                </Link>
            </div>
        </div>
    );
}
