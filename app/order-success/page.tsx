'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { CheckCircle2 } from 'lucide-react';

function SuccessContent() {
    const params = useSearchParams();
    const orderNum = params.get('num') || 'BHK-????';
    const total = Number(params.get('total') || 0);

    return (
        <div className="min-h-dvh flex flex-col bg-deep">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="w-full max-w-sm">
                    <div className="bg-card border border-bdr rounded-2xl p-6 sm:p-8 text-center">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 bg-lime/10 text-lime">
                            <CheckCircle2 size={30} />
                        </div>
                        <h1 className="font-display font-bold text-2xl mb-2">Order Placed!</h1>
                        <p className="text-sm text-t2 leading-relaxed mb-6">
                            Your snacks are reserved. Collect your order from <strong>405 C room</strong> and pay cash/UPI.
                        </p>
                        <div className="bg-card-hi rounded-xl p-4 mb-6 text-left space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-t3">Order #</span>
                                <span className="font-bold">{orderNum}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-t3">Amount Due</span>
                                <span className="font-display font-bold text-lg text-lime">{formatCurrency(total)}</span>
                            </div>
                        </div>
                        <Link href="/menu" className="w-full block text-center bg-card-hi border border-bdr text-sm font-semibold py-3 rounded-xl hover:bg-elev transition-colors">
                            Back to Menu
                        </Link>
                    </div>
                </motion.div>
            </div>
            <BottomNav />
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-dvh bg-deep"><Navbar /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
