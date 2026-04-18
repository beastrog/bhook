'use client';

import { createContext, useContext } from 'react';

export const StoreStatusContext = createContext(false);

export function StoreStatusProvider({ closed, children }: { closed: boolean; children: React.ReactNode }) {
    return (
        <StoreStatusContext.Provider value={closed}>
            {children}
        </StoreStatusContext.Provider>
    );
}

export const useStoreStatus = () => useContext(StoreStatusContext);
