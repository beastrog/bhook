'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCardMini from '@/components/ProductCardMini';

export default function LandingClient({ featuredProducts }: { featuredProducts: Product[] }) {
    return (
        <div className="max-w-lg mx-auto">
            {/* Hero */}
            <section className="px-5 pt-12 pb-10">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    {/* Live pill */}
                    <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded-full"
                        style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Open tonight</span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-black leading-none mb-4" style={{ fontSize: 'clamp(40px, 11vw, 56px)', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                        Order<br />Snacks<span style={{ color: 'var(--accent)' }}>.</span>
                    </h1>

                    <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Browse items, reserve your order,<br />pay cash at pickup. No account needed.
                    </p>

                    <Link href="/menu" className="btn btn-orange-pill flex items-center gap-2" style={{ width: 'fit-content' }}>
                        Browse Menu <ArrowRight size={16} />
                    </Link>
                </motion.div>

                {/* How it works */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
                    className="flex items-center gap-0 mt-12"
                    style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}
                >
                    {[['01', 'Browse'], ['02', 'Reserve'], ['03', 'Pickup']].map(([num, label], i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-black" style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}>{num}</span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* Tonight's picks */}
            {featuredProducts.length > 0 && (
                <motion.section
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between px-5 mb-4">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                            Tonight's picks
                        </p>
                        <Link href="/menu" className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                            See all →
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto px-5 pb-1 snap-x snap-mandatory scrollbar-hide">
                        {featuredProducts.map((p) => (
                            <ProductCardMini key={p.id} product={p} />
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Info strip */}
            <div className="mx-5 mb-12 p-4 rounded-2xl text-center" style={{ background: 'var(--bg-1)', border: '1px solid var(--border-subtle)' }}>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    💵 No online payments · Pay cash when you pickup · No signup required
                </p>
            </div>

            {/* Feature list */}
            <div className="px-5 grid grid-cols-2 gap-3 mb-16">
                {[
                    { e: '⚡', t: 'Reserve instantly', s: 'Stock held in seconds' },
                    { e: '🔒', t: 'No login needed', s: 'Name & room only' },
                    { e: '💵', t: 'Cash at pickup', s: 'Offline payment only' },
                    { e: '📦', t: 'Live inventory', s: 'Real-time stock counts' },
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
                        className="card p-4"
                        style={{ borderRadius: '14px' }}
                    >
                        <p className="text-xl mb-2">{f.e}</p>
                        <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{f.t}</p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{f.s}</p>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="text-center pb-10">
                <p className="font-black text-base tracking-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    bhook<span style={{ color: 'var(--accent)' }}>.</span>
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Tonight's hunger, sorted.</p>
            </div>
        </div>
    );
}
