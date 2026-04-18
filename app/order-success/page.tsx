'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import { Check } from 'lucide-react';

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
                    <div className="structural-panel p-10 md:p-14 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-[0.03] rounded-full blur-[60px] pointer-events-none" />

                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black mb-10 border border-white/20">
                            <Check size={32} strokeWidth={3} />
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-black mb-4 tracking-tighter uppercase text-white">Transmission <br />Successful</h1>
                        <p className="text-zinc-500 leading-relaxed mb-12 text-sm">
                            Your inventory blocks are secured. Proceed to the root admin room for physical cash exchange and extraction.
                        </p>

                        <div className="bg-white/5 rounded-xl p-6 mb-10 text-left border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order Hash</span>
                                <span className="font-mono font-bold text-white">{orderNum}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sum Due</span>
                                <span className="font-black text-xl text-[var(--accent)] font-mono">{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <Link href="/menu" className="btn btn-secondary w-full text-xs tracking-widest uppercase">
                            Terminate Session
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
