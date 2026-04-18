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
        toast.success('Added to cart');
        setTimeout(() => setJustAdded(false), 800);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`relative flex flex-col p-4 ${isOOS ? 'opacity-30 grayscale' : ''}`}
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl bg-[var(--bg-2)] p-2 rounded-xl">{emoji(product.category)}</span>
                        <div>
                            <h3 className="font-bold text-lg leading-tight truncate" style={{ letterSpacing: '-0.02em' }}>{product.name}</h3>
                            <p className="font-bold" style={{ color: 'var(--text-secondary)' }}>{formatCurrency(product.selling_price)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                        <span className={`pill ${isOOS ? 'pill-red' : 'pill-grey'}`}>
                            {isOOS ? 'Sold Out' : `${product.stock_quantity} left`}
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col items-end justify-center pt-2">
                    {qty > 0 ? (
                        <div className="flex items-center gap-3 bg-[var(--bg-2)] py-1.5 px-1.5 rounded-full border border-[rgba(255,255,255,0.05)]">
                            <button
                                onClick={() => updateQuantity(product.id, qty - 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-3)] hover:bg-[rgba(255,255,255,0.2)] transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{qty}</span>
                            <button
                                onClick={handleAdd}
                                disabled={qty >= product.stock_quantity}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--text-primary)] text-black disabled:opacity-30 transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            disabled={isOOS}
                            className="px-5 py-3 rounded-full font-bold text-sm transition-all disabled:opacity-30 flex items-center gap-2"
                            style={{
                                background: justAdded ? 'var(--accent)' : 'var(--text-primary)',
                                color: 'var(--bg)',
                            }}
                        >
                            <Plus size={16} strokeWidth={2.5} /> {justAdded ? 'Added' : 'Add'}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
