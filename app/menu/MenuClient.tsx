'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';

const CATS = ['All', 'Chips', 'Noodles', 'Drinks', 'Chocolates', 'Biscuits', 'Others'];

export default function MenuClient({ products }: { products: Product[] }) {
    const [search, setSearch] = useState('');
    const [cat, setCat] = useState('All');
    const totalItems = useCartStore((s) => s.getTotalItems());
    const total = useCartStore((s) => s.getTotal());

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const mc = cat === 'All' || p.category === cat;
            const ms = p.name.toLowerCase().includes(search.toLowerCase());
            return mc && ms && p.active;
        });
    }, [products, search, cat]);

    const available = filtered.filter((p) => p.stock_quantity > 0);
    const oos = filtered.filter((p) => p.stock_quantity === 0);

    return (
        <div className="pb-32 md:pb-16">
            <div className="max-w-5xl mx-auto px-5 pt-6 sm:pt-8 md:pt-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={13} className="text-lime" />
                            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3">Tonight&apos;s Selection</span>
                        </div>
                        <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight">Menu</h1>
                    </div>
                    <div className="relative w-full sm:w-56">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-t3" />
                        <input type="text" placeholder="Search snacks..." value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border border-bdr rounded-xl pl-9 pr-3 py-2.5 text-sm text-t1 placeholder:text-t3 outline-none focus:border-lime/40 transition-colors" />
                    </div>
                </div>

                {/* Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1 mb-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {CATS.map((c) => (
                        <button key={c} onClick={() => setCat(c)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase border transition-all ${cat === c
                                    ? 'bg-lime text-deep border-lime'
                                    : 'bg-transparent text-t3 border-bdr hover:border-bdr-hi'
                                }`}>
                            {c}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {available.length === 0 && oos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-sm text-t3">No snacks found. Try a different category.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                            {available.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                        {oos.length > 0 && (
                            <div className="mt-10">
                                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-3">Out of stock</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                                    {oos.map((p) => <ProductCard key={p.id} product={p} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Floating cart bar */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className="fixed bottom-16 md:bottom-6 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-sm z-40">
                        <Link href="/cart"
                            className="flex items-center justify-between bg-lime text-deep rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(200,255,0,0.25)]">
                            <div className="flex items-center gap-2.5">
                                <span className="bg-deep/15 w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[11px]">{totalItems}</span>
                                <span className="font-bold text-sm hidden sm:inline">items in cart</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold">{formatCurrency(total)}</span>
                                <ArrowRight size={15} strokeWidth={2.5} />
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
