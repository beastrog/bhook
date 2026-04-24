'use client';

import { useStoreStatus } from './StoreStatusProvider';

export default function RealtimeBanner() {
    const isClosed = useStoreStatus();

    if (!isClosed) return null;

    return (
        <div className="bg-err text-[#000000] text-center text-xs sm:text-sm font-extrabold tracking-tight py-2 px-4 sticky top-0 z-[100] shadow-[0_4px_20px_rgba(248,113,113,0.3)] anim-fade-up">
            Store will open at 9:30 PM. Stay Tuned!
        </div>
    );
}
