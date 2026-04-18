'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingClient() {
  return (
    <div className="w-full relative z-10 flex flex-col items-center pt-24 md:pt-40 pb-32 px-6 overflow-hidden">

      {/* Background optical illusion element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10">

        {/* Sleek Minimal Hero */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-zinc-400 tracking-widest uppercase mb-10 w-fit mx-auto relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              <span className="w-2 h-2 rounded-full bg-white relative z-10 animate-pulse" />
              <span className="relative z-10">Snack Booking Engine V2</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[1.05] mb-10">
              Frictionless <br />
              <span className="text-gradient">Consumption.</span>
            </h1>

            <p className="text-lg md:text-2xl text-zinc-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
              The high-performance platform for hostel snack reservations. Instant atomic locks, zero digital payments.
            </p>

            <Link href="/menu" className="btn btn-primary text-sm md:text-lg w-full sm:w-auto overflow-hidden group">
              <span className="relative z-10 flex items-center gap-3">
                Initialize System <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Structural Mind-Bending Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { tag: "01 // Browse", title: "Live Inventory", desc: "Access the decentralized database of available items, updated in real-time to prevent out-of-stock frustrating." },
            { tag: "02 // Reserve", title: "Atomic Locks", desc: "Adding to cart instantly removes the item from global circulation. Your snacks are guaranteed." },
            { tag: "03 // Collect", title: "Cash Settlement", desc: "Offline transactions only. Walk to the admin node, hand over the physical currency, and extract your goods." }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + (idx * 0.1), ease: [0.16, 1, 0.3, 1] }}
              className="structural-panel p-8 md:p-12 relative overflow-hidden group"
            >
              {/* Abstract hover shape */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-[40px] group-hover:scale-150 group-hover:bg-white/10 transition-all duration-700 pointer-events-none" />

              <p className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-4">{feature.tag}</p>
              <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{feature.title}</h3>
              <p className="text-zinc-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
