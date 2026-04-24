'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminPushManager from './AdminPushManager';

export default function AdminHeader() {
    const path = usePathname();
    const title = getTitle(path);

    return (
        <header className="sticky top-0 z-40 bg-deep/80 backdrop-blur-xl border-b border-bdr">
            <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="w-8 h-8 rounded-lg overflow-hidden border border-bdr grayscale hover:grayscale-0 transition-all">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </Link>
                    <h1 className="font-display font-bold text-sm tracking-tight text-t1 uppercase tracking-[0.1em]">{title}</h1>
                </div>

                <AdminPushManager />
            </div>
        </header>
    );
}

function getTitle(path: string) {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/products')) return 'Stock Manager';
    if (path.includes('/orders')) return 'Live Orders';
    if (path.includes('/profit-split')) return 'Profit Split';
    if (path.includes('/settings')) return 'Settings';
    return 'Admin';
}
