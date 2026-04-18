'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingClient() {
    return (
        <div className="w-full flex justify-center pb-32">
            <div className="w-full max-w-[2560px] px-8 md:px-16 xl:px-32">

                {/* Spacer for grand empty space */}
                <div className="h-[20vh] md:h-[25vh]" />

                <div className="flex flex-col lg:flex-row justify-between items-start w-full">

                    {/* Asymmetric Left: The Massive Statement */}
                    <motion.div
                        className="w-full lg:w-[60%] pr-0 lg:pr-16"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <p className="text-label mb-8 text-[var(--accent)] drop-shadow-[0_0_10px_rgba(226,254,83,0.5)]">
                            SYSTEM ONLINE // ACCEPTING RESERVATIONS
                        </p>

                        <h1 className="title-massive mb-12">
                            TONIGHT'S CRAVINGS. <br />
                            <span className="opacity-40">RESERVED.</span>
                        </h1>

                        <p className="text-body max-w-2xl text-xl md:text-2xl mb-16" style={{ fontWeight: 500 }}>
                            Precision snacking for the late-night elite. Lock in your inventory now, pay cash at collection. No lines. No friction.
                        </p>

                        <div className="flex w-full md:w-auto">
                            <Link href="/menu" className="btn btn-primary w-full md:w-auto hover:pl-16 transition-all duration-300 flex items-center justify-between gap-8 group">
                                <span>Access The Vault</span>
                                <ArrowRight size={20} strokeWidth={3} className="transform group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Asymmetric Right: Empty Space / Structural Sub-data */}
                    <motion.div
                        className="w-full lg:w-[40%] mt-32 lg:mt-0 pt-16 lg:pt-0 layer-1 p-10 lg:p-16 relative"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }}
                    >
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-[rgba(71,71,71,0.2)] lg:hidden" />
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-[rgba(71,71,71,0.2)] hidden lg:block" />

                        <div className="flex flex-col gap-16">
                            <div>
                                <p className="text-label mb-4 tracking-[0.1em] text-[var(--primary)]">01 // BROWSE</p>
                                <p className="text-body">Inspect the inventory. Real-time stock status updated to the millisecond.</p>
                            </div>
                            <div>
                                <p className="text-label mb-4 tracking-[0.1em] text-[var(--primary)]">02 // RESERVE</p>
                                <p className="text-body">Execute your order securely. The database locks your items instantly.</p>
                            </div>
                            <div>
                                <p className="text-label mb-4 tracking-[0.1em] text-[var(--primary)]">03 // COLLECT</p>
                                <p className="text-body">Extract items from the host room. Cash transactions only.</p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
