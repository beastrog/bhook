'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { CheckCircle2 } from 'lucide-react';

function SuccessContent() {
    const params = useSearchParams();
    const orderNum = params.get('num') || 'BHK-????';
    const total = Number(params.get('total') || 0);

    return (
        <div className="min-h-dvh flex flex-col relative z-10">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="glass-panel p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Soft background glow internal */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/10 blur-[60px] -z-10" />

                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-8 border border-green-500/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                            <CheckCircle2 size={40} strokeWidth={2.5} />
                        </div>

                        <h1 className="text-3xl font-black mb-3">Reservation Locked</h1>
                        <p className="text-zinc-400 leading-relaxed mb-10">
                            Your snacks are secured. Please drop by the admin room and hand over the cash to collect.
                        </p>

                        <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-400 font-medium">Order Number</span>
                                <span className="font-mono font-bold text-lg">{orderNum}</span>
                            </div>

                            <div className="h-px w-full bg-white/5" />

                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 font-medium text-sm">Amount Due</span>
                                <span className="font-black text-2xl text-orange-500 drop-shadow-md">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <Link href="/menu" className="btn btn-secondary w-full">
                            Back to Inventory
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh relative z-10"><Navbar /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
