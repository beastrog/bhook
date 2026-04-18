'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingClient() {
    return (
        <div className="max-w-xl mx-auto px-6 overflow-hidden pb-20">

            {/* Spacer */}
            <div className="h-[12vh]" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>

                {/* Availability Badge */}
                <div className="pill pill-accent mb-8 uppercase" style={{ letterSpacing: '0.08em', fontSize: '10px' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mr-2 animate-pulse" />
                    Currently operational
                </div>

                {/* Hyper-minimal Typography */}
                <h1 className="title-huge mb-6">
                    Snacks. <br />
                    <span style={{ color: 'var(--text-secondary)' }}>Instantly.</span>
                </h1>

                <p className="text-lg leading-relaxed mb-12 max-w-sm" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Reserve your midnight cravings. Pay offline when you pick them up. Zero friction.
                </p>

                {/* Brutalist-style actions */}
                <div className="flex items-center gap-4">
                    <Link href="/menu" className="btn btn-accent flex items-center gap-2">
                        Open Menu <ArrowRight size={18} strokeWidth={2.5} />
                    </Link>
                </div>
            </motion.div>

            {/* Structural layout - High contrast grid */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-24 pt-12" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
                <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                    <div>
                        <p className="text-overline mb-2">01. Browse</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>View live inventory without creating an account.</p>
                    </div>
                    <div>
                        <p className="text-overline mb-2">02. Reserve</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lock in your items. Stock updates in real-time.</p>
                    </div>
                    <div>
                        <p className="text-overline mb-2">03. Collect</p>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Grab your order and pay cash instantly.</p>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
