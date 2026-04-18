'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const totalItems = useCartStore((s) => s.getTotalItems());

    return (
        <nav className="nav-glass sticky top-0 z-50 py-4 transition-all duration-300">
            <div className="flex items-center justify-between px-8 md:px-16 xl:px-32 max-w-[2560px] mx-auto w-full">

                <Link href="/" className="flex items-center outline-none group">
                    {/* Brutalist logotype */}
                    <span className="text-2xl font-black tracking-[-0.05em] uppercase" style={{ color: 'var(--primary)' }}>
                        THE VAULT<span className="text-[var(--accent)] text-3xl leading-none">.</span>
                    </span>
                </Link>

                {/* Minimal Navigation Items desktop */}
                <div className="hidden md:flex items-center gap-12 font-mono text-sm tracking-[0.1em] text-[var(--text-secondary)] font-bold">
                    <Link href="/menu" className="hover:text-[var(--primary)] transition-colors">INVENTORY</Link>
                    <Link href="/admin/login" className="hover:text-[var(--primary)] transition-colors text-[var(--text-tertiary)]">SYS_ADMIN</Link>
                </div>

                <Link href="/cart" className="relative group outline-none flex items-center gap-4 bg-[var(--surface-high)] px-6 py-3 hover:bg-[var(--primary)] transition-colors">
                    <ShoppingCart size={18} strokeWidth={2.5} className="text-white group-hover:text-black transition-colors" />
                    <span className="hidden sm:inline font-mono font-bold text-sm tracking-wider text-white group-hover:text-black transition-colors">
                        RESERVATIONS
                    </span>
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.div
                                key="badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center font-bold"
                                style={{ background: 'var(--accent)', color: 'black', fontSize: '11px' }}
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
