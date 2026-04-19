'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';

export default function HydrationProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Manually rehydrate Zustand store from localStorage after mount
        // Required because we use skipHydration: true to prevent SSR mismatches
        useCartStore.persist.rehydrate();
    }, []);

    return <>{children}</>;
}
