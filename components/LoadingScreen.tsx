'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Minimum display time to ensure the animation feels smooth
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-deep flex flex-col items-center justify-center p-6"
                >
                    {/* Glowing background particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-lime/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lime/5 rounded-full blur-[120px] animate-pulse delay-700" />
                    </div>

                    <div className="relative flex flex-col items-center gap-6">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-lime blur-[40px] opacity-20 animate-pulse" />
                            <h1 className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-white relative">
                                BHOOKH
                            </h1>
                            <div className="absolute -top-4 -right-4">
                                <Sparkles size={32} className="text-lime animate-bounce" />
                            </div>
                        </motion.div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden relative">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-lime"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                            </div>
                            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-t3 animate-pulse">
                                Sizzling Tonight
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Hook to handle a global loading state if needed throughout the app
 */
export function useLoadingTrigger() {
    const [isLoading, setIsLoading] = useState(false);
    return { isLoading, setIsLoading };
}
