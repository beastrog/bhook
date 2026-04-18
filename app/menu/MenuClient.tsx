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
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-2">Vault Inventory</h1>
                        <p className="text-zinc-400">Select your items to reserve them.</p>
                    </div>

                    <div className="relative w-full md:w-[350px]">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search snacks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-glass pl-12 w-full"
                        />
                    </div>
                </div>

                {/* Glass Filter Pills */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 mb-8 mask-edges">
                    {CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
                ${cat === c
                                    ? 'bg-white text-black border-transparent shadow-[0_4px_20px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white'}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="w-full">
                    {available.length === 0 && oos.length === 0 ? (
                        <div className="h-[30vh] flex flex-col items-center justify-center text-zinc-500">
                            <p className="text-xl font-bold">Nothing matches your search.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {available.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>

                            {oos.length > 0 && (
                                <div className="mt-20">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-px bg-white/10 flex-1" />
                                        <p className="text-xs font-bold tracking-widest uppercase text-zinc-600">Depleted items</p>
                                        <div className="h-px bg-white/10 flex-1" />
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

            {/* Floating Glass Cart */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 150, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 150, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-6 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-[600px] z-50 mx-auto"
                    >
                        <Link href="/cart" className="block w-full">
                            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:bg-white/15 transition-all">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full px-8 py-5 flex items-center justify-between shadow-inner">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center justify-center bg-white/20 text-white font-black w-10 h-10 rounded-full text-lg">
                                            {totalItems}
                                        </span>
                                        <span className="font-bold text-lg hidden sm:block">Items selected</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <p className="font-black text-2xl drop-shadow-md">{formatCurrency(total)}</p>
                                        <div className="bg-white text-orange-600 w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
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
