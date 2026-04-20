'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import CookedProductCard from '@/components/CookedProductCard';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';

export default function MaggiClient({ products }: { products: Product[] }) {
    const [search, setSearch] = useState('');
    const [mounted, setMounted] = useState(false);
    const totalItems = useCartStore((s) => s.getTotalItems());
    const total = useCartStore((s) => s.getTotal());
    useEffect(() => { setMounted(true); }, []);
    const displayCount = mounted ? totalItems : 0;
    const displayTotal = mounted ? total : 0;

    // Filter only cooked products
    const cookedProducts = useMemo(() => {
        return products.filter((p) => {
            const isCooked = p.category === 'Cooked';
            const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
            return isCooked && matchesSearch && p.active;
        });
    }, [products, search]);

    const available = cookedProducts.filter((p) => p.stock_quantity > 0);
    const oos = cookedProducts.filter((p) => p.stock_quantity === 0);

    return (
        <div className="pb-32 md:pb-16 min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
            {/* Premium Glowing Background Effect */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] rounded-full blur-[120px] opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }}></div>
            <div className="absolute top-[10%] right-[-10%] w-[50%] h-[40%] rounded-full blur-[100px] opacity-[0.15] pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)' }}></div>

            <div className="max-w-5xl mx-auto px-5 pt-6 sm:pt-10 md:pt-14 relative z-10">
                {/* Header tailored for Cooked items */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/20 text-orange-400">
                                <Flame size={14} className="animate-pulse" />
                            </span>
                            <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: '#fb923c', textShadow: '0 0 10px rgba(251,146,60,0.5)' }}>
                                Signature Hot Meals
                            </span>
                        </div>
                        <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tighter text-white flex items-center gap-3 drop-shadow-lg">
                            Freshly Cooked
                        </h1>
                        <p className="text-sm text-[#a1a1aa] mt-3 max-w-md leading-relaxed">
                            Premium midnight fuel prepared fresh on order. <br />
                            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-medium">
                                📞 Call 8570809208 within 5 mins to confirm.
                            </span>
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400/50" />
                        <input type="text" placeholder="Search our kitchen..." value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-[#18181b]/80 backdrop-blur-xl border border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-[#a1a1aa] outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all" />
                    </div>
                </div>

                {/* Grid */}
                {available.length === 0 && oos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-[#18181b]/40 border border-white/5 rounded-3xl backdrop-blur-xl">
                        <div className="text-6xl mb-6 drop-shadow-2xl grayscale opacity-30">🍜</div>
                        <h2 className="text-xl font-bold text-white mb-2">Kitchen is quiet</h2>
                        <p className="text-sm text-[#a1a1aa]">We couldn&apos;t find any hot meals matching your search.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                            {available.map((p) => <CookedProductCard key={p.id} product={p} />)}
                        </div>
                        {oos.length > 0 && (
                            <div className="mt-16">
                                <div className="flex items-center gap-4 mb-6 opacity-60">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#a1a1aa]">Sold Out Today</p>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 opacity-60 hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {oos.map((p) => <CookedProductCard key={p.id} product={p} />)}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Floating cart bar */}
            <AnimatePresence>
                {displayCount > 0 && (
                    <motion.div
                        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className="fixed bottom-16 md:bottom-6 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-sm z-40">
                        <Link href="/cart"
                            className="flex items-center justify-between bg-lime text-[#000000] rounded-2xl px-5 py-3 shadow-[0_8px_32px_rgba(200,255,0,0.25)] hover:scale-[1.02] transition-transform">
                            <div className="flex items-center gap-2.5">
                                <span className="bg-deep/15 w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[11px]">{displayCount}</span>
                                <span className="font-bold text-sm hidden sm:inline">items in cart</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold">{formatCurrency(displayTotal)}</span>
                                <ArrowRight size={15} strokeWidth={2.5} />
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
