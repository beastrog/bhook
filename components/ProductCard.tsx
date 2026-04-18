'use client';

import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
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
        toast.success('System reserved: ' + product.name);
        setTimeout(() => setJustAdded(false), 800);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative flex flex-col p-8 md:p-12 transition-all duration-300 layer-1 hover:bg-[var(--surface-container)] w-full h-full justify-between group ${isOOS ? 'opacity-30 grayscale' : ''}`}
        >
            <div>
                <div className="flex justify-between items-start mb-16">
                    <span className="text-4xl lg:text-5xl drop-shadow-2xl">{emoji(product.category)}</span>
                    <span className="text-label" style={{ color: isOOS ? 'var(--error)' : 'var(--text-tertiary)' }}>
                        {isOOS ? 'DEPLETED' : `QTY ${product.stock_quantity}`}
                    </span>
                </div>

                <h3 className="title-section text-2xl lg:text-3xl mb-4 truncate group-hover:text-[var(--primary)] transition-colors">{product.name}</h3>
                <p className="font-bold text-xl text-[var(--accent)] tracking-tight font-mono">{formatCurrency(product.selling_price)}</p>
            </div>

            <div className="mt-16 w-full opacity-100 lg:opacity-0 lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                {qty > 0 ? (
                    <div className="flex items-center justify-between w-full layer-float border-[2px] border-[rgba(71,71,71,0.2)] p-2">
                        <button
                            onClick={() => updateQuantity(product.id, qty - 1)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-[var(--surface-high)] transition-colors"
                        >
                            <Minus size={18} color="white" />
                        </button>
                        <span className="font-bold text-lg font-mono">{qty}</span>
                        <button
                            onClick={handleAdd}
                            disabled={qty >= product.stock_quantity}
                            className="w-12 h-12 flex items-center justify-center hover:bg-[var(--surface-high)] disabled:opacity-30 transition-colors"
                        >
                            <Plus size={18} color="white" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleAdd}
                        disabled={isOOS}
                        className="w-full btn btn-primary flex justify-between items-center bg-[var(--primary)] text-black"
                    >
                        <span>{justAdded ? 'LOCKED' : 'ACQUIRE'}</span>
                        <Plus size={18} strokeWidth={3} />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
