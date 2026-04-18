'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const total = getTotal();

    if (items.length === 0) {
        return (
            <div className="min-h-dvh flex flex-col relative z-10">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                    <div className="structural-panel p-16 flex flex-col items-center text-center max-w-md w-full">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 text-2xl">
                            [ ]
                        </div>
                        <h2 className="text-2xl font-black mb-3 text-white uppercase tracking-tighter">Buffer is Empty</h2>
                        <p className="text-zinc-500 font-mono text-sm mb-10">NO BLOCKS RESERVED</p>
                        <Link href="/menu" className="btn btn-primary w-full">
                            Access Database
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh pb-40 relative z-10">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-16 md:pt-24">

                <div className="flex items-baseline justify-between mb-12">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gradient">Data Array</h1>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">{items.length} nodes</p>
                </div>

                <div className="structural-panel overflow-hidden">
                    <div className="flex flex-col">
                        <AnimatePresence>
                            {items.map((item, i) => (
                                <motion.div
                                    key={item.product.id}
                                    layout
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                                    className={`p-6 md:p-8 flex items-center gap-6 ${i !== items.length - 1 ? 'border-b border-white/5' : ''}`}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-zinc-400 flex-shrink-0">
                                        {item.product.name[0].toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-lg md:text-xl leading-tight truncate mb-1 text-white">{item.product.name}</p>
                                        <p className="font-mono text-zinc-400 text-sm">
                                            {formatCurrency(item.product.selling_price * item.quantity)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-8">

                                        <div className="bg-white/5 border border-white/10 rounded-full p-1 flex items-center gap-1">
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                                                <Minus size={14} />
                                            </button>
                                            <span className="font-bold font-mono text-sm w-8 text-center text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock_quantity}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${item.quantity < item.product.stock_quantity ? 'bg-white text-black hover:bg-zinc-200' : 'opacity-20'}`}
                                            >
                                                <Plus size={14} strokeWidth={2.5} />
                                            </button>
                                        </div>

                                        <button onClick={() => removeItem(item.product.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="bg-white/2 p-6 md:p-8 border-t border-white/10 flex sm:items-center justify-between flex-col sm:flex-row gap-6">
                        <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest max-w-[200px]">
                            Offline physical cash transaction required at collection node.
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-2">Total Compute</p>
                            <p className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-white">{formatCurrency(total)}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px] z-50">
                <Link href="/checkout" className="btn btn-primary w-full text-lg shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    <span className="flex-1 text-center font-bold tracking-tight">EXECUTE RESERVATION</span>
                    <div className="bg-black/10 w-10 h-10 rounded-full flex items-center justify-center -mr-3">
                        <ArrowRight size={20} strokeWidth={2.5} />
                    </div>
                </Link>
            </div>
        </div>
    );
}
