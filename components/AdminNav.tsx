'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ClipboardList, BarChart2, Settings } from 'lucide-react';

const LINKS = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Home' },
    { href: '/admin/products', icon: Package, label: 'Stock' },
    { href: '/admin/orders', icon: ClipboardList, label: 'Orders' },
    { href: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminNav() {
    const path = usePathname();
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
            style={{ background: 'rgba(12,12,12,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
                {LINKS.map(({ href, icon: Icon, label }) => {
                    const active = path.startsWith(href);
                    return (
                        <Link key={href} href={href}
                            className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all"
                            style={{ color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                            <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
                            <span className="text-[9px] font-semibold tracking-wide uppercase">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
