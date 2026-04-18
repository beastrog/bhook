'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Package, CreditCard, MapPin } from 'lucide-react';

const features = [
  { icon: Package, n: '01', t: 'Browse', d: 'Check real-time stock of every snack available tonight.' },
  { icon: CreditCard, n: '02', t: 'Reserve', d: 'Lock your items instantly. Stock updates for everyone.' },
  { icon: MapPin, n: '03', t: 'Collect', d: 'Walk to the room, pay in cash, grab your haul.' },
];

export default function LandingClient() {
  return (
    <div className="max-w-5xl mx-auto px-5 pb-28 md:pb-16">
      {/* Hero */}
      <section className="pt-16 sm:pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-28 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 text-[10px] font-extrabold tracking-widest uppercase bg-lime/8 text-lime border border-lime/15">
            <div className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" /> Open Now
          </div>

          <h1 className="font-display font-bold text-[clamp(2.5rem,8vw,5rem)] leading-[1.02] tracking-tighter mb-6">
            CRUSH<br />THE<br className="sm:hidden" /> CRAVING<span className="text-lime">.</span>
          </h1>

          <p className="text-base sm:text-lg text-t2 max-w-md mb-10 leading-relaxed">
            Midnight fuel for the restless. High-voltage snacks reserved before the neon fades.
          </p>

          <Link href="/menu"
            className="inline-flex items-center gap-3 bg-lime text-black font-extrabold text-[15px] px-8 py-4 rounded-full hover:shadow-[0_4px_20px_rgba(200,255,0,0.25)] transition-all active:scale-[0.97]">
            Shop Now <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section>
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-5">How it works</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, n, t, d }, i) => (
            <motion.div key={n}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              className="bg-card border border-bdr rounded-2xl p-5 sm:p-6 hover:border-bdr-hi hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-lime/8 text-lime">
                  <Icon size={16} strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-t3">{n}</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{t}</h3>
              <p className="text-sm text-t2 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-bdr text-center flex flex-col items-center">
        <img src="/logo.png" alt="BHOOKH Logo" className="w-12 h-12 rounded-xl mb-3 object-cover" />
        <p className="font-display font-bold text-lg text-lime tracking-tight mb-2">BHOOKH</p>
        <div className="flex justify-center gap-4 text-[11px] text-t3 mb-3">
          <Link href="/menu" className="hover:text-t2 transition-colors">Menu</Link>
        </div>
        <p className="text-[11px] text-t3">© {new Date().getFullYear()} Bhookh. Midnight Snack Store.</p>
      </footer>
    </div>
  );
}
