'use client';

import Link from 'next/link';
import { ShoppingBag, LayoutGrid } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const totalItems = useCartStore((s) => s.getTotalItems());

    return (
        <nav className="glass-nav sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                        <span className="font-black italic pr-0.5">b</span>
                    </div>
                    <span className="font-black text-xl tracking-tight">bhook.</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8 font-semibold text-sm text-zinc-400">
                    <Link href="/menu" className="hover:text-white transition-colors flex items-center gap-2">
                        <LayoutGrid size={16} /> Inventory
                    </Link>
                    <Link href="/admin/login" className="hover:text-white transition-colors opacity-50 hover:opacity-100">
                        Admin Access
                    </Link>
                </div>

                <Link href="/cart" className="relative group p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
                    <ShoppingBag size={20} className="text-zinc-300 group-hover:text-white transition-colors" />
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.div
                                key="badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-1 -right-1 w-[22px] h-[22px] flex items-center justify-center font-bold"
                                style={{ background: 'var(--primary)', color: 'white', fontSize: '11px', borderRadius: '50%' }}
                            >
                                {totalItems > 9 ? '9+' : totalItems}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>
        </nav>
    );
}
