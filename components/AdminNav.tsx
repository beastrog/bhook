'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ClipboardList, BarChart2, Settings } from 'lucide-react';

const LINKS = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/admin/products', icon: Package, label: 'Stock' },
    { href: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { href: '/admin/analytics', icon: BarChart2, label: 'Stats' },
    { href: '/admin/settings', icon: Settings, label: 'Config' },
];

export default function AdminNav() {
    const path = usePathname();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-deep/90 backdrop-blur-xl border-t border-bdr pb-[env(safe-area-inset-bottom,0)]">
            <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
                {LINKS.map(({ href, icon: Icon, label }) => {
                    const active = path.startsWith(href);
                    return (
                        <Link key={href} href={href}
                            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${active ? 'text-lime' : 'text-t3'}`}>
                            <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                            <span className="text-[9px] font-bold tracking-widest uppercase">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
