'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, MapPin, Banknote } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';

function SuccessContent() {
    const params = useSearchParams();
    const orderNum = params.get('num') || 'BHK-????';
    const total = Number(params.get('total') || 0);

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-12" style={{ background: 'var(--bg)' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: 'var(--green-bg)', border: '1px solid rgba(34,197,94,0.2)' }}
                >
                    <Check size={28} style={{ color: 'var(--green)' }} strokeWidth={2.5} />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h1 className="font-black text-3xl mb-2" style={{ letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
                        Reserved<span style={{ color: 'var(--accent)' }}>!</span>
                    </h1>
                    <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Your snacks are set aside. Come over to collect them.
                    </p>
                </motion.div>

                {/* Order number */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="card p-4 mb-3 flex items-center justify-between"
                    style={{ borderRadius: '14px' }}
                >
                    <div>
                        <p className="text-label mb-0.5">Order number</p>
                        <p className="font-black text-lg" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{orderNum}</p>
                    </div>
                    <span className="badge badge-green">Confirmed</span>
                </motion.div>

                {/* Info cards */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="space-y-2 mb-8"
                >
                    <div className="card p-4 flex items-start gap-3" style={{ borderRadius: '14px' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--accent-bg)' }}>
                            <MapPin size={16} style={{ color: 'var(--accent)' }} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Pickup Location</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Come to the seller's room</p>
                        </div>
                    </div>

                    <div className="card p-4 flex items-start gap-3" style={{ borderRadius: '14px' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'var(--green-bg)' }}>
                            <Banknote size={16} style={{ color: 'var(--green)' }} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Cash Payment</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                Bring <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(total)}</strong> cash when you pickup
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-3">
                    <Link href="/menu" className="btn btn-orange-pill w-full flex justify-center py-4">
                        Order More →
                    </Link>
                    <Link href="/" className="btn btn-ghost w-full flex justify-center py-3 text-sm">
                        Back to home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--bg)' }}>
                <div className="w-8 h-8 rounded-xl skeleton" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
