'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';

export default function LandingClient() {
    return (
        <div className="w-full relative z-10 pt-12 md:pt-24 pb-32 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center space-y-8 mb-24 md:mb-40">

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold text-orange-400">
                            <Flame size={16} className="text-orange-500 animate-pulse" />
                            <span>Midnight reservations now active</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-[100px] font-black tracking-tight leading-[1.05]"
                    >
                        Cravings <br />
                        <span className="text-gradient">Handled.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl text-lg md:text-xl text-zinc-400 font-medium"
                    >
                        The exclusive hostel snack vault. Reserve your favorites instantly, collect from the room, and pay with zero friction.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="pt-4">
                        <Link href="/menu" className="btn btn-primary text-lg px-8 py-5 flex items-center justify-center gap-3 w-full sm:w-auto">
                            <span>Enter The Vault</span>
                            <ArrowRight size={20} strokeWidth={3} />
                        </Link>
                    </motion.div>
                </div>

                {/* Feature Grid - Adaptive Layout */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="glass-panel p-8 md:p-10 flex flex-col gap-4 hover:border-orange-500/30 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl font-black">1</div>
                        <h3 className="text-2xl font-bold">Browse</h3>
                        <p className="text-zinc-400 leading-relaxed">Explore our curated selection of late-night snacks. Stock is synced in real-time so you never miss out.</p>
                    </div>

                    <div className="glass-panel p-8 md:p-10 flex flex-col gap-4 hover:border-orange-500/30 transition-colors transform md:-translate-y-4">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl font-black">2</div>
                        <h3 className="text-2xl font-bold">Reserve</h3>
                        <p className="text-zinc-400 leading-relaxed">Add items to your tray and lock them in instantly. No account required—just pure speed.</p>
                    </div>

                    <div className="glass-panel p-8 md:p-10 flex flex-col gap-4 hover:border-orange-500/30 transition-colors md:-translate-y-8">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl font-black">3</div>
                        <h3 className="text-2xl font-bold">Collect</h3>
                        <p className="text-zinc-400 leading-relaxed">Drop by the admin room to collect your haul. Hand over cash and you're good to go.</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
