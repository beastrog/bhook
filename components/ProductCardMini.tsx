'use client';

import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';

function emoji(cat: string) {
    return ({ Chips: '🍟', Noodles: '🍜', Chocolates: '🍫', Drinks: '🥤', Biscuits: '🍪' } as any)[cat] ?? '🍿';
}

export default function ProductCardMini({ product }: { product: Product }) {
    const addItem = useCartStore((s) => s.addItem);
    const [added, setAdded] = useState(false);
    const isOOS = product.stock_quantity === 0;

    const handleAdd = () => {
        if (isOOS) return;
        addItem(product);
        setAdded(true);
        toast.success(`${product.name} added`);
        setTimeout(() => setAdded(false), 1300);
    };

    return (
        <div
            className={`card hover-lift flex-shrink-0 snap-start flex flex-col overflow-hidden ${isOOS ? 'opacity-40' : ''}`}
            style={{ width: 148, borderRadius: '14px' }}
        >
            <div className="flex items-center justify-center text-3xl"
                style={{ height: 88, background: 'var(--bg-2)' }}>
                {emoji(product.category)}
            </div>
            <div className="p-2.5 flex flex-col gap-2">
                <p className="text-xs font-semibold leading-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {product.name}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                        {formatCurrency(product.selling_price)}
                    </span>
                    <button
                        onClick={handleAdd}
                        disabled={isOOS}
                        className="w-6 h-6 rounded-md flex items-center justify-center transition-all disabled:opacity-30"
                        style={{ background: added ? 'rgba(34,197,94,0.15)' : 'var(--accent)', color: added ? 'var(--green)' : '#fff' }}
                    >
                        {added ? <Check size={11} /> : <Plus size={11} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
