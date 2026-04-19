import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/lib/types';

interface OrderRecord {
    id: string;
    number: string;
    total: number;
    date: string;
    status: string;
    items_count: number;
}

interface CartStore {
    items: CartItem[];
    recentOrders: OrderRecord[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    addOrder: (order: OrderRecord) => void;
    getTotal: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            recentOrders: [],

            addOrder: (order) => set((state) => ({ recentOrders: [order, ...state.recentOrders].slice(0, 10) })),

            addItem: (product: Product, quantity = 1) => {
                set((state) => {
                    const existing = state.items.find((i) => i.product.id === product.id);
                    if (existing) {
                        const newQty = Math.min(existing.quantity + quantity, product.stock_quantity);
                        return {
                            items: state.items.map((i) =>
                                i.product.id === product.id ? { ...i, quantity: newQty } : i
                            ),
                        };
                    }
                    return { items: [...state.items, { product, quantity: Math.min(quantity, product.stock_quantity) }] };
                });
            },

            removeItem: (productId: string) => {
                set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.product.id === productId
                            ? { ...i, quantity: Math.min(quantity, i.product.stock_quantity) }
                            : i
                    ),
                }));
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce((sum, item) => sum + item.product.selling_price * item.quantity, 0);
            },

            getTotalItems: () => {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        { name: 'bhook-cart', skipHydration: true }
    )
);
