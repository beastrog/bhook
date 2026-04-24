'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';
import { useStoreStatus } from '@/components/StoreStatusProvider';

const catEmoji: Record<string, string> = {
    Chips: '🍟', Noodles: '🍜', Chocolates: '🍫', Drinks: '🥤', Biscuits: '🍪',
};

export default function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
    const { addItem, items, updateQuantity } = useCartStore();
    const [justAdded, setJustAdded] = useState(false);
    // Defer Zustand (localStorage) reads to client only — prevents React #418 hydration errors
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const cartItem = mounted ? items.find((i) => i.product.id === product.id) : undefined;
    const qty = cartItem?.quantity ?? 0;
    const isClosed = useStoreStatus();
    const isOOS = isClosed || product.stock_quantity === 0;


    const handleAdd = () => {
        if (isOOS || qty >= product.stock_quantity) return;
        addItem(product);
        setJustAdded(true);
        toast.success(`Added ${product.name}`);
        setTimeout(() => setJustAdded(false), 800);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-card border border-bdr rounded-2xl overflow-hidden flex flex-col hover:border-bdr-hi transition-all ${product.stock_quantity === 0 ? 'opacity-30 grayscale pointer-events-none' : ''}`}
        >
            {/* Image area */}
            <div className="relative aspect-square flex items-center justify-center bg-card-hi">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading={priority ? "eager" : "lazy"} />
                ) : (
                    <span className="text-4xl sm:text-5xl select-none">{catEmoji[product.category] || '🍿'}</span>
                )}
                <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isClosed ? 'bg-err/10 text-err' : isOOS ? 'bg-err/10 text-err' : product.stock_quantity <= 5 ? 'bg-warn/10 text-warn' : 'bg-ok/10 text-ok'
                        }`}>
                        {isClosed ? 'CLOSED' : isOOS ? 'OUT' : `${product.stock_quantity}`}
                    </span>
                </div>
            </div>

            {/* Info + action */}
            <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                <h3 className="font-semibold text-[13px] leading-snug mb-0.5 line-clamp-2">{product.name}</h3>
                <p className="text-[11px] text-t3 mb-2.5">{product.category}</p>

                <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-[15px] text-lime">{formatCurrency(product.selling_price)}</span>

                    {qty > 0 ? (
                        <div className="flex items-center bg-card-hi rounded-lg">
                            <button onClick={() => updateQuantity(product.id, qty - 1)} disabled={isClosed}
                                className="w-7 h-7 flex items-center justify-center text-t2 disabled:opacity-30">
                                <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="font-bold text-xs w-5 text-center">{qty}</span>
                            <button onClick={handleAdd} disabled={isClosed || qty >= product.stock_quantity}
                                className="w-7 h-7 flex items-center justify-center bg-lime text-[#000000] rounded-r-lg disabled:bg-card-hi disabled:text-t3 disabled:opacity-100">
                                <Plus size={12} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleAdd} disabled={isOOS}
                            className={`h-7 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${justAdded
                                ? 'bg-ok/10 text-ok'
                                : isClosed
                                    ? 'bg-card-hi text-t3 cursor-not-allowed opacity-100'
                                    : 'border border-bdr text-t2 hover:bg-lime hover:text-[#000000] hover:border-lime'
                                }`}>
                            {justAdded ? <><Check size={11} /> Added</> : isClosed ? 'Closed' : <><Plus size={11} /> Add</>}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
