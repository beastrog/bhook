'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export const StoreStatusContext = createContext(false);

export function StoreStatusProvider({ closed: initialClosed, children }: { closed: boolean; children: React.ReactNode }) {
    const [isClosed, setIsClosed] = useState(initialClosed);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel('settings-realtime')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'key=eq.store_status' },
                (payload: { new: any }) => {
                    const newVal = payload.new as { key: string; value: string };
                    setIsClosed(newVal.value === 'closed');
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <StoreStatusContext.Provider value={isClosed}>
            {children}
        </StoreStatusContext.Provider>
    );
}

export const useStoreStatus = () => useContext(StoreStatusContext);
