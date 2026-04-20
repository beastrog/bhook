'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Check, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';
import { useStoreStatus } from '@/components/StoreStatusProvider';

export default function CookedProductCard({ product }: { product: Product }) {
    const { addItem, items, updateQuantity } = useCartStore();
    const [justAdded, setJustAdded] = useState(false);
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
        toast.success(`Added ${product.name} 🍜`, {
            description: 'Call 8570809208 to confirm & arrange payment',
            duration: 4000,
        });
        setTimeout(() => setJustAdded(false), 800);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl overflow-hidden flex flex-col border-2 transition-all ${product.stock_quantity === 0
                    ? 'opacity-40 grayscale pointer-events-none border-bdr'
                    : 'border-orange-400/30 hover:border-orange-400/60'
                }`}
            style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.06) 0%, rgba(239,68,68,0.03) 100%)' }}>
            {/* Image area */}
            <div className="relative aspect-square flex items-center justify-center"
                style={{ background: 'rgba(251,146,60,0.08)' }}>
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                    <span className="text-4xl sm:text-5xl select-none">🍜</span>
                )}
                {/* Stock badge */}
                <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isClosed ? 'bg-err/10 text-err'
                            : isOOS ? 'bg-err/10 text-err'
                                : product.stock_quantity <= 5 ? 'bg-orange-400/20 text-orange-400'
                                    : 'bg-orange-400/20 text-orange-400'
                        }`}>
                        {isClosed ? 'CLOSED' : isOOS ? 'OUT' : `${product.stock_quantity}`}
                    </span>
                </div>
                {/* Flame badge */}
                <div className="absolute top-2 left-2">
                    <Flame size={12} className="text-orange-400" />
                </div>
            </div>

            {/* Info + action */}
            <div className="p-3 sm:p-3.5 flex flex-col flex-1">
                <h3 className="font-semibold text-[13px] leading-snug mb-0.5 line-clamp-2">{product.name}</h3>
                <p className="text-[11px] text-orange-400/70 mb-2">Cooked Fresh</p>

                <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-[15px] text-orange-400">{formatCurrency(product.selling_price)}</span>

                    {qty > 0 ? (
                        <div className="flex items-center rounded-lg" style={{ background: 'rgba(251,146,60,0.1)' }}>
                            <button onClick={() => updateQuantity(product.id, qty - 1)} disabled={isClosed}
                                className="w-7 h-7 flex items-center justify-center text-t2 disabled:opacity-30">
                                <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="font-bold text-xs w-5 text-center">{qty}</span>
                            <button onClick={handleAdd} disabled={isClosed || qty >= product.stock_quantity}
                                className="w-7 h-7 flex items-center justify-center rounded-r-lg text-[#000000] disabled:bg-card-hi disabled:text-t3 disabled:opacity-100"
                                style={{ background: qty >= product.stock_quantity ? undefined : '#fb923c' }}>
                                <Plus size={12} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleAdd} disabled={isOOS}
                            className={`h-7 px-3 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${justAdded
                                ? 'bg-ok/10 text-ok'
                                : isClosed
                                    ? 'bg-card-hi text-t3 cursor-not-allowed opacity-100'
                                    : 'border border-orange-400/40 text-orange-400 hover:bg-orange-400 hover:text-[#000000] hover:border-orange-400'
                                }`}>
                            {justAdded ? <><Check size={11} /> Added</> : isClosed ? 'Closed' : <><Plus size={11} /> Add</>}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
