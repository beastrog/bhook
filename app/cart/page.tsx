'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, X, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency, formatDateShort } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export default function CartPage() {
    const { items, recentOrders, removeItem, updateQuantity, getTotal } = useCartStore();
    const total = getTotal();

    const RecentOrdersSection = () => {
        if (!recentOrders?.length) return null;
        return (
            <div className="mt-8 border-t border-bdr pt-8">
                <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-lime" /> Recent Orders
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recentOrders.slice(0, 4).map(o => (
                        <div key={o.id} className="bg-card border border-bdr rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-sm text-t1 flex items-center gap-2">
                                    #{o.number}
                                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-lime/10 text-lime uppercase tracking-wider">{o.status}</span>
                                </p>
                                <p className="text-[11px] text-t3 mt-1">{formatDateShort(o.date)} • {o.items_count} items</p>
                            </div>
                            <div className="font-bold text-sm text-lime">{formatCurrency(o.total)}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (items.length === 0) {
        return (
            <div className="min-h-dvh flex flex-col bg-deep pb-24 md:pb-12">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-5 pt-12 text-center max-w-3xl mx-auto w-full">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-card border border-bdr mx-auto">
                        <ShoppingBag size={28} className="text-t3" />
                    </div>
                    <h2 className="font-display font-bold text-2xl mb-2">Your Stash is Empty</h2>
                    <p className="text-sm text-t2 mb-8 max-w-xs mx-auto">Add some midnight fuel from the menu.</p>
                    <Link href="/menu" className="bg-lime text-[#000000] font-extrabold px-8 py-3 rounded-full hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] mb-12">
                        Browse Menu
                    </Link>

                    <div className="w-full text-left">
                        <RecentOrdersSection />
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-deep pb-28 md:pb-12">
            <Navbar />
            <div className="max-w-5xl mx-auto px-5 pt-6 sm:pt-8 md:pt-10">
                <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-1">Your Stash</h1>
                <p className="text-xs text-t3 mb-5">{items.length} item{items.length !== 1 ? 's' : ''} reserved</p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* Items */}
                    <div className="lg:col-span-3 bg-card border border-bdr rounded-2xl overflow-hidden">
                        <AnimatePresence>
                            {items.map((item, i) => (
                                <motion.div key={item.product.id} layout
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                                    className={`p-3.5 flex items-center gap-3 ${i < items.length - 1 ? 'border-b border-bdr' : ''}`}>
                                    {item.product.image_url ? (
                                        <img src={item.product.image_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-elev" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-card-hi">
                                            {item.product.name[0]}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">{item.product.name}</p>
                                        <p className="text-[11px] text-t3">{item.product.category}</p>
                                        <p className="text-sm font-bold text-lime mt-0.5">{formatCurrency(item.product.selling_price * item.quantity)}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <div className="flex items-center bg-card-hi rounded-lg">
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center text-t2"><Minus size={12} strokeWidth={2.5} /></button>
                                            <span className="font-bold text-xs w-5 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.product.stock_quantity}
                                                className="w-7 h-7 flex items-center justify-center bg-lime text-[#000000] rounded-r-lg disabled:opacity-30">
                                                <Plus size={12} strokeWidth={2.5} /></button>
                                        </div>
                                        <button onClick={() => removeItem(item.product.id)} className="w-7 h-7 flex items-center justify-center text-t3 hover:text-err transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-card border border-bdr rounded-2xl p-5 lg:sticky lg:top-20">
                            <h3 className="font-display font-bold text-lg mb-4">Summary</h3>
                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-t2">Subtotal</span>
                                    <span className="font-semibold">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-t2">Delivery</span>
                                    <span className="font-semibold text-ok">Free</span>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-bdr flex justify-between items-baseline">
                                <span className="font-display font-bold">Total</span>
                                <span className="font-display font-bold text-2xl text-lime">{formatCurrency(total)}</span>
                            </div>
                            <Link href="/checkout"
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-lime text-[#000000] font-extrabold py-3.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97]">
                                Checkout <ArrowRight size={16} strokeWidth={2.5} />
                            </Link>
                        </div>
                    </div>
                </div>

                <RecentOrdersSection />
            </div>
            <BottomNav />
        </div>
    );
}
