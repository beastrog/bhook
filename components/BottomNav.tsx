'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingBag, Flame } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useEffect, useState } from 'react';

const TABS = [
    { href: '/', icon: Home, label: 'Feed' },
    { href: '/menu', icon: UtensilsCrossed, label: 'Snacks' },
    { href: '/maggi', icon: Flame, label: 'Cooked' },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', isCart: true },
];

export default function BottomNav() {
    const path = usePathname();
    const totalItems = useCartStore((s) => s.getTotalItems());
    // Defer Zustand (localStorage) read to client only to prevent hydration mismatch (React #418)
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const displayCount = mounted ? totalItems : 0;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-deep/90 backdrop-blur-xl border-t border-bdr pb-[env(safe-area-inset-bottom,0)]">
            <div className="flex items-center justify-around px-2 py-2">
                {TABS.map(({ href, icon: Icon, label, isCart }) => {
                    const active = href === '/' ? path === '/' : path.startsWith(href);
                    return (
                        <Link key={href} href={href}
                            className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all active:scale-[0.95] ${active ? 'text-lime' : 'text-t3 hover:text-t2'}`}>
                            {isCart && displayCount > 0 && (
                                <span className="absolute -top-1 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-lime text-[#000000] text-[8px] font-black">
                                    {displayCount > 9 ? '9+' : displayCount}
                                </span>
                            )}
                            <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                            <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
