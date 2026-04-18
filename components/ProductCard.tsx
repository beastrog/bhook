'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, Check } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';

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
        toast.success('Block reserved');
        setTimeout(() => setJustAdded(false), 1000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`structural-panel p-6 flex flex-col justify-between group transition-all duration-300 ${isOOS ? 'opacity-40 grayscale' : ''}`}
        >
            <div className="flex justify-between items-start mb-10">
                <div className="text-3xl filter drop-shadow-md">
                    {product.name[0].toUpperCase()}
                </div>
                <div className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${isOOS ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-white/5 text-zinc-400 border-white/10 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors'}`}>
                    {isOOS ? 'OFFLINE' : `QTY ${product.stock_quantity}`}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-bold mb-1 tracking-tight text-white">{product.name}</h3>
                <p className="font-mono font-bold text-zinc-400">{formatCurrency(product.selling_price)}</p>
            </div>

            <div className="mt-auto h-12">
                {qty > 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-full h-full p-1 max-w-[160px] flex items-center justify-between">
                        <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="w-10 h-10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center text-white">{qty}</span>
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
                        className={`w-full h-full rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2
              ${justAdded
                                ? 'bg-[var(--accent)] text-black'
                                : 'bg-white/5 hover:bg-white text-zinc-400 hover:text-black border border-white/10 hover:border-white'}`}
                    >
                        {justAdded ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={2.5} />}
                        {justAdded ? 'LOCKED' : 'ACQUIRE'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
