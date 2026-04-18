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
        <div className="min-h-dvh flex flex-col pb-48 relative z-10">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 w-full">

                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-4 text-gradient">Data Vault</h1>
                        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Select blocks to reserve.</p>
                    </div>

                    <div className="relative w-full md:w-[350px]">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Query database..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-minimal pl-12 w-full font-mono text-sm lg:text-base"
                        />
                    </div>
                </div>

                {/* Minimal Filters */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 mb-12">
                    {CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`flex-shrink-0 px-5 py-2 uppercase tracking-widest text-xs font-bold transition-all duration-300 border-b-2
                ${cat === c
                                    ? 'text-white border-white'
                                    : 'text-zinc-600 border-transparent hover:text-zinc-300'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="w-full">
                    {available.length === 0 && oos.length === 0 ? (
                        <div className="h-[30vh] flex flex-col items-center justify-center text-zinc-600 font-mono">
                            <p>NO DATA MATCHES QUERY.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {available.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>

                            {oos.length > 0 && (
                                <div className="mt-32">
                                    <div className="flex items-center gap-4 mb-8">
                                        <p className="text-[10px] font-bold tracking-widest uppercase text-red-500/70 border border-red-500/20 bg-red-500/5 px-3 py-1 rounded-sm">Depleted Nodes</p>
                                        <div className="h-px bg-white/5 flex-1" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {oos.map((p) => <ProductCard key={p.id} product={p} />)}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Floating Architectural Cart */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 150, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 150, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px] z-50 mx-auto"
                    >
                        <Link href="/cart" className="block w-full">
                            <div className="bg-black/80 backdrop-blur-3xl border border-white/20 p-2 rounded-[24px] group transition-all hover:border-[var(--accent)]">
                                <div className="bg-white text-black rounded-[18px] px-8 py-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center bg-black text-white font-mono font-bold w-10 h-10 rounded-xl text-lg">
                                            {totalItems}
                                        </span>
                                        <span className="font-bold text-lg hidden sm:block uppercase tracking-tight">Blocks Indexed</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-black text-2xl font-mono">{formatCurrency(total)}</p>
                                        <div className="bg-black text-[var(--accent)] w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                                            <ArrowRight strokeWidth={3} size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
