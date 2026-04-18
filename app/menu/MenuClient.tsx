'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
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
        <div className="min-h-dvh bg-black pb-32">
            <Navbar />
            <div className="max-w-xl mx-auto px-6 pt-6">

                {/* Header */}
                <h1 className="title-medium mb-6">Tonight's Menu.</h1>

                {/* Minimal Search Line */}
                <div className="relative mb-8">
                    <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-b-2 border-[var(--border-subtle)] py-3 pl-8 text-lg font-medium outline-none focus:border-[var(--text-primary)] transition-colors"
                    />
                </div>

                {/* Clean Pill filter */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8">
                    {CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all uppercase tracking-wider"
                            style={{
                                background: cat === c ? 'var(--text-primary)' : 'transparent',
                                color: cat === c ? '#000' : 'var(--text-secondary)',
                                border: `1px solid ${cat === c ? 'transparent' : 'var(--border)'}`
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* List Grid */}
                <div className="flex flex-col">
                    {available.length === 0 && oos.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p className="text-lg font-bold">No items found.</p>
                        </div>
                    ) : (
                        <>
                            {available.map((p) => <ProductCard key={p.id} product={p} />)}

                            {oos.length > 0 && (
                                <div className="mt-12">
                                    <p className="text-overline mb-4 opacity-50">Sold Out</p>
                                    {oos.map((p) => <ProductCard key={p.id} product={p} />)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Floating brutalist Cart bar */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 180 }}
                        className="fixed bottom-6 left-6 right-6 z-50 max-w-xl mx-auto"
                    >
                        <Link href="/cart">
                            <div className="bg-[var(--accent)] text-black rounded-full px-6 py-4 flex items-center justify-between shadow-[0_0_40px_rgba(226,254,83,0.15)]">
                                <span className="font-bold tracking-tight">{totalItems} selected</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-lg">{formatCurrency(total)}</span>
                                    <ArrowRight strokeWidth={2.5} size={20} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
