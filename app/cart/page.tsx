'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
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
            <div className="min-h-dvh flex flex-col relative z-10">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="glass-panel p-12 flex flex-col items-center text-center max-w-sm w-full">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <span className="text-4xl">🛒</span>
                        </div>
                        <h2 className="text-2xl font-black mb-2">Tray is empty</h2>
                        <p className="text-zinc-400 mb-8">Go add some snacks before they run out.</p>
                        <Link href="/menu" className="btn btn-primary w-full shadow-lg">
                            Return to Vault
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh pb-40 relative z-10">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-10 md:pt-16">

                <div className="flex items-baseline justify-between mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Your Tray</h1>
                    <p className="text-zinc-400 font-bold">{items.length} items</p>
                </div>

                <div className="glass-panel overflow-hidden">
                    <div className="flex flex-col">
                        <AnimatePresence>
                            {items.map((item, i) => (
                                <motion.div
                                    key={item.product.id}
                                    layout
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                                    className={`p-6 flex items-center gap-6 ${i !== items.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">
                                        {emoji(item.product.category)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg leading-tight truncate mb-1">{item.product.name}</p>
                                        <p className="font-bold text-orange-500">
                                            {formatCurrency(item.product.selling_price * item.quantity)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-6">

                                        <div className="bg-white/5 border border-white/10 rounded-full p-1 flex items-center gap-1 shadow-inner">
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock_quantity}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.quantity < item.product.stock_quantity ? 'bg-white text-black hover:bg-zinc-200' : 'opacity-30'}`}
                                            >
                                                <Plus size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>

                                        <button onClick={() => removeItem(item.product.id)} className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="bg-white/5 p-6 border-t border-white/5 flex sm:items-center justify-between flex-col sm:flex-row gap-4">
                        <div className="text-zinc-400 text-sm">
                            Payment will be collected offline <br className="hidden sm:block" />at the collection point (cash only).
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Total Due</p>
                            <p className="text-4xl font-black">{formatCurrency(total)}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px] z-50">
                <Link href="/checkout" className="btn btn-primary w-full text-lg shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
                    <span className="flex-1 text-center font-black">Proceed to reservation</span>
                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm -mr-3">
                        <ArrowRight size={20} strokeWidth={2.5} />
                    </div>
                </Link>
            </div>
        </div>
    );
}
