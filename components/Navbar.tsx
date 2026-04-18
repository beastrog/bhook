'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const totalItems = useCartStore((s) => s.getTotalItems());

    return (
        <nav className="sticky top-0 z-50 bg-deep/90 backdrop-blur-xl border-b border-bdr">
            <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-14">
                <Link href="/" className="flex items-center gap-2 group">
                    <img src="/logo.png" alt="BHOOK Logo" className="w-8 h-8 rounded-lg object-cover group-hover:scale-105 transition-transform" />
                    <span className="font-display font-bold text-xl tracking-tight text-lime hidden sm:inline-block">BHOOK</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-t2">
                    <Link href="/" className="hover:text-t1 transition-colors">Home</Link>
                    <Link href="/menu" className="hover:text-t1 transition-colors">Menu</Link>
                </div>

                <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-bdr hover:bg-card-hi transition-colors">
                    <ShoppingBag size={17} className="text-t2" />
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.span key="b" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-lime text-black text-[10px] font-black">
                                {totalItems > 9 ? '9+' : totalItems}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>
        </nav>
    );
}
