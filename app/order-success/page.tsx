'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';

function SuccessContent() {
    const params = useSearchParams();
    const orderNum = params.get('num') || 'BHK-????';
    const total = Number(params.get('total') || 0);

    return (
        <div className="min-h-dvh bg-black flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-sm"
                >
                    {/* Stark Status */}
                    <div className="text-[var(--accent)] font-black text-6xl mb-6">✓</div>

                    <h1 className="title-medium mb-2">Reserved.</h1>
                    <p className="text-sm mb-12 text-[var(--text-secondary)] leading-relaxed">
                        Your snacks are set aside. Please collect them and hand over the cash as soon as possible.
                    </p>

                    <div className="flex flex-col gap-6 mb-12">
                        <div className="border-b border-[var(--border-subtle)] pb-4 flex justify-between items-end">
                            <span className="text-overline">Order Number</span>
                            <span className="font-bold text-lg">{orderNum}</span>
                        </div>

                        <div className="border-b border-[var(--border-subtle)] pb-4 flex justify-between items-end">
                            <span className="text-overline">Amount Due</span>
                            <span className="font-black text-2xl text-[var(--accent)]">{formatCurrency(total)}</span>
                        </div>

                        <div className="border-b border-[var(--border-subtle)] pb-4 flex justify-between items-end">
                            <span className="text-overline">Payment Method</span>
                            <span className="font-bold">Cash at Pickup</span>
                        </div>
                    </div>

                    <Link href="/menu" className="btn btn-secondary w-full">
                        Back to Menu
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-black"><Navbar /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
