'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';

function emoji(cat: string) {
    return ({ Chips: '🍟', Noodles: '🍜', Chocolates: '🍫', Drinks: '🥤', Biscuits: '🍪' } as any)[cat] ?? '🍿';
}

export default function ProductCard({ product }: { product: Product }) {
    const { addItem, items, updateQuantity } = useCartStore();
    const [justAdded, setJustAdded] = useState(false);
    const cartItem = items.find((i) => i.product.id === product.id);
    const qty = cartItem?.quantity ?? 0;
    const isOOS = product.stock_quantity === 0;

    const handleAdd = () => {
        if (isOOS || qty >= product.stock_quantity) return;
        addItem(product);
        setJustAdded(true);
        toast.success('Added to tray');
        setTimeout(() => setJustAdded(false), 1000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel p-6 flex flex-col justify-between group transition-all duration-300 hover:border-white/20 ${isOOS ? 'opacity-50 grayscale' : 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]'}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-4xl shadow-inner">
                    {emoji(product.category)}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isOOS ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white/5 text-zinc-400 border-white/10'}`}>
                    {isOOS ? 'Out of stock' : `${product.stock_quantity} remaining`}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold mb-1 leading-tight">{product.name}</h3>
                <p className="font-bold text-orange-500 text-lg">{formatCurrency(product.selling_price)}</p>
            </div>

            <div className="mt-auto h-12">
                {qty > 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-full h-full p-1 max-w-[160px] flex items-center justify-between shadow-inner">
                        <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center">{qty}</span>
                        <button
                            onClick={handleAdd}
                            disabled={qty >= product.stock_quantity}
                            className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center disabled:opacity-30 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAdd}
                        disabled={isOOS}
                        className={`h-full rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 px-6
              ${justAdded
                                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30'}`}
                    >
                        {justAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
                        {justAdded ? 'Added' : 'Add to Tray'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
