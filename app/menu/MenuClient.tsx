'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';

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
        <div className="min-h-dvh flex flex-col pb-48">
            <Navbar />

            {/* Expansive Header */}
            <div className="w-full max-w-[2560px] mx-auto px-8 md:px-16 xl:px-32 pt-16 md:pt-32">
                <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-16 md:mb-24 gap-12">
                    <div>
                        <p className="text-label mb-6 text-[var(--accent)] tracking-[0.2em]">DATABASE SEARCH</p>
                        <h1 className="title-massive text-[80px] lg:text-[120px]">THE VAULT.</h1>
                    </div>

                    <div className="relative w-full lg:w-[500px]">
                        <input
                            type="text"
                            placeholder="Query inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-12 placeholder:opacity-50 font-mono text-xl"
                        />
                        <Search size={22} className="absolute left-2 top-[22px] text-[var(--text-tertiary)]" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Minimal text-based filters */}
                <div className="flex gap-8 overflow-x-auto scrollbar-hide mb-16 pb-4 border-b-2 border-[rgba(71,71,71,0.2)]">
                    {CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`text-label transition-colors pb-4 -mb-[18px] ${cat === c ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]' : 'text-[var(--text-tertiary)] hover:text-white'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* True Grid Setup */}
                <div className="w-full">
                    {available.length === 0 && oos.length === 0 ? (
                        <div className="h-[40vh] flex items-center justify-center">
                            <p className="text-body font-mono opacity-50">0 RESULTS FOUND</p>
                        </div>
                    ) : (
                        <>
                            {/* Massive masonry-style grid gaps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[2px] bg-[rgba(71,71,71,0.2)]">
                                {available.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>

                            {oos.length > 0 && (
                                <div className="mt-32">
                                    <p className="text-label mb-8 tracking-[0.2em] text-[var(--error)]">DEPLETED INVENTORY</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[2px] bg-[rgba(71,71,71,0.2)]">
                                        {oos.map((p) => <ProductCard key={p.id} product={p} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Slide-out persistent brutalist cart module */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 lg:bottom-12 right-0 lg:right-12 z-50 w-full lg:w-[480px]"
                    >
                        <div className="bg-[var(--surface-high)] lg:border-[2px] lg:border-[rgba(71,71,71,0.2)] p-1">
                            <div className="bg-[var(--accent)] text-black p-6 pl-8 flex justify-between items-center group cursor-pointer hover:bg-white transition-colors">
                                <Link href="/cart" className="absolute inset-0 z-10" />
                                <div>
                                    <p className="text-label text-black tracking-[0.1em] opacity-80 mb-1">RESERVATION STATUS</p>
                                    <p className="font-black text-3xl font-mono tracking-tighter">{totalItems} UNITS</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className="font-black text-2xl font-mono">{formatCurrency(total)}</p>
                                    <ArrowRight strokeWidth={4} size={28} className="transform group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
