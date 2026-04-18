'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Minus } from 'lucide-react';
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
    const isLow = product.stock_quantity > 0 && product.stock_quantity <= 5;

    const handleAdd = () => {
        if (isOOS || qty >= product.stock_quantity) return;
        addItem(product);
        setJustAdded(true);
        toast.success(`${product.name} added`);
        setTimeout(() => setJustAdded(false), 1200);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card hover-lift flex flex-col overflow-hidden ${isOOS ? 'opacity-40' : ''}`}
            style={{ borderRadius: '14px' }}
        >
            {/* Emoji area */}
            <div
                className="flex items-center justify-center text-4xl"
                style={{ height: 100, background: 'var(--bg-2)' }}
            >
                {emoji(product.category)}
            </div>

            <div className="flex flex-col flex-1 p-3 gap-2">
                {/* Stock indicator */}
                {isOOS ? (
                    <span className="badge badge-red" style={{ width: 'fit-content' }}>Out of stock</span>
                ) : isLow ? (
                    <span className="badge badge-amber" style={{ width: 'fit-content' }}>{product.stock_quantity} left</span>
                ) : (
                    <span className="badge badge-grey" style={{ width: 'fit-content' }}>{product.stock_quantity} left</span>
                )}

                <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {product.name}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
                        {formatCurrency(product.selling_price)}
                    </span>

                    {/* Qty controls or Add */}
                    {qty > 0 ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateQuantity(product.id, qty - 1)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                style={{ background: 'var(--bg-3)', color: 'var(--text-primary)' }}
                            >
                                <Minus size={11} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center" style={{ color: 'var(--text-primary)' }}>{qty}</span>
                            <button
                                onClick={handleAdd}
                                disabled={qty >= product.stock_quantity}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
                                style={{ background: 'var(--accent)', color: '#fff' }}
                            >
                                <Plus size={11} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAdd}
                            disabled={isOOS}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-30"
                            style={{
                                background: justAdded ? 'rgba(34,197,94,0.15)' : 'var(--accent-bg)',
                                color: justAdded ? 'var(--green)' : 'var(--accent)',
                                border: `1px solid ${justAdded ? 'rgba(34,197,94,0.3)' : 'var(--accent-border)'}`,
                            }}
                        >
                            {justAdded ? <><Check size={11} /> Added</> : <><Plus size={11} /> Add</>}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
