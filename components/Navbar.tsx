'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const totalItems = useCartStore((s) => s.getTotalItems());

    return (
        <nav className="nav-blur sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 h-16 max-w-xl mx-auto">
                <Link href="/" className="flex items-center gap-2 outline-none">
                    <span className="text-xl font-black tracking-tighter" style={{ color: 'var(--text-primary)' }}>
                        bhook<span style={{ color: 'var(--accent)' }}>.</span>
                    </span>
                </Link>

                <Link href="/cart" className="relative btn btn-icon outline-none">
                    <ShoppingCart size={18} strokeWidth={2} />
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.div
                                key="badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                                style={{ background: 'var(--accent)', color: 'var(--accent-fg)', fontSize: '10px' }}
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
