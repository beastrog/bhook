'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';

const CATS = ['All', 'Chips', 'Noodles', 'Chocolates', 'Drinks', 'Biscuits', 'Others'];

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
        <div className="max-w-lg mx-auto pb-36">
            {/* Header */}
            <div className="px-5 pt-5 pb-4">
                <h1 className="font-black text-2xl mb-0.5" style={{ letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                    Menu
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{products.length} items tonight</p>
            </div>

            {/* Search */}
            <div className="px-5 mb-4">
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
                    <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <input
                        type="text"
                        placeholder="Search snacks…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: 'var(--text-primary)' }}
                    />
                </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 px-5 pb-5 overflow-x-auto scrollbar-hide">
                {CATS.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCat(c)}
                        className="flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={
                            cat === c
                                ? { background: 'var(--accent)', color: '#fff' }
                                : { background: 'var(--bg-1)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                        }
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="px-5">
                {available.length === 0 && oos.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-3xl mb-3">🔍</p>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Nothing found</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Try a different search or category</p>
                    </div>
                ) : (
                    <>
                        {available.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {available.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                        )}
                        {oos.length > 0 && (
                            <>
                                <p className="text-label mb-3">Out of stock</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {oos.map((p) => <ProductCard key={p.id} product={p} />)}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Floating cart bar */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', damping: 24, stiffness: 200 }}
                        className="fixed bottom-5 left-4 right-4 max-w-screen-sm mx-auto z-50"
                    >
                        <Link href="/cart">
                            <div
                                className="flex items-center justify-between px-5 py-4 rounded-2xl"
                                style={{ background: 'var(--accent)' }}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                                        <ShoppingCart size={14} color="#fff" />
                                    </span>
                                    <span className="font-semibold text-sm text-white">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-white">{formatCurrency(total)}</p>
                                    <p className="text-xs text-white/70">View Cart →</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
