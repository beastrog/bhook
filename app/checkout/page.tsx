'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, ArrowRight, Phone, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { placeOrder } from '@/app/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const [form, setForm] = useState({ customer_name: '', room_number: '', phone_number: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [cookedPopup, setCookedPopup] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState('');

    const hasCookedItems = items.some(i => i.product.category === 'Cooked');
    const cookedItems = items.filter(i => i.product.category === 'Cooked');

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.customer_name.trim()) e.customer_name = 'Name is required';
        if (!form.room_number.trim()) e.room_number = 'Room number is required';
        return e;
    };

    const handleSubmit = async (ev?: React.FormEvent) => {
        ev?.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        if (!items.length) { toast.error('Cart is empty'); return; }
        setLoading(true);
        try {
            const { data, error } = await placeOrder({
                customer_name: form.customer_name.trim(),
                room_number: form.room_number.trim(),
                phone_number: form.phone_number.trim() || undefined,
                items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
            });
            if (error) { toast.error(error); return; }

            const orderedTotal = total;

            // Save to recent
            useCartStore.getState().addOrder({
                id: data!.order_id,
                number: data!.order_number,
                total: orderedTotal,
                date: new Date().toISOString(),
                status: 'reserved',
                items_count: items.reduce((acc, curr) => acc + curr.quantity, 0),
                productIds: items.map(i => i.product.id)
            });

            clearCart();
            const redirectUrl = `/order-success?id=${data!.order_id}&num=${encodeURIComponent(data!.order_number)}&total=${orderedTotal}`;

            // If cooked items present, show call popup before redirecting
            if (hasCookedItems) {
                setPendingRedirect(redirectUrl);
                setCookedPopup(true);
            } else {
                router.push(redirectUrl);
            }
        } catch { toast.error('Something went wrong. Please try again.'); }
        finally { setLoading(false); }
    };

    if (!items.length && !cookedPopup) {
        return (
            <div className="min-h-dvh bg-deep">
                <Navbar />
                <div className="max-w-5xl mx-auto px-5 pt-12 text-center text-t3 text-sm">Your cart is empty.</div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-deep pb-28 md:pb-12">
            <Navbar />
            <div className="max-w-5xl mx-auto px-5 pt-6 sm:pt-8 md:pt-10">
                <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-1">Checkout</h1>
                <p className="text-xs text-t3 mb-6">Fill your details and confirm your reservation.</p>

                {/* Cooked items notice */}
                {hasCookedItems && (
                    <div className="mb-5 rounded-xl p-3.5 border-2 flex items-start gap-3"
                        style={{ borderColor: 'rgba(251,146,60,0.4)', background: 'rgba(251,146,60,0.06)' }}>
                        <span className="text-xl flex-shrink-0">🍜</span>
                        <div>
                            <p className="font-bold text-sm text-orange-400">Cooked Items in Cart</p>
                            <p className="text-[11px] text-t3 mt-0.5">
                                After placing order, <strong className="text-orange-400">call 8570809208</strong> to confirm your cooked items and arrange payment.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    <form onSubmit={handleSubmit} className="lg:col-span-3 bg-card border border-bdr rounded-2xl p-5 space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Your Name *</label>
                            <input className={`w-full bg-deep border rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 transition-colors
                ${errors.customer_name ? 'border-err' : 'border-bdr focus:border-lime/40'}`}
                                placeholder="e.g. Rahul" value={form.customer_name} autoFocus
                                onChange={(e) => { setForm({ ...form, customer_name: e.target.value }); setErrors({ ...errors, customer_name: '' }); }} />
                            {errors.customer_name && <p className="text-xs text-err mt-1">{errors.customer_name}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Room Number *</label>
                            <input className={`w-full bg-deep border rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 transition-colors
                ${errors.room_number ? 'border-err' : 'border-bdr focus:border-lime/40'}`}
                                placeholder="e.g. G-204" value={form.room_number}
                                onChange={(e) => { setForm({ ...form, room_number: e.target.value }); setErrors({ ...errors, room_number: '' }); }} />
                            {errors.room_number && <p className="text-xs text-err mt-1">{errors.room_number}</p>}
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Phone (optional)</label>
                            <input className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors"
                                type="tel" placeholder="98765 43210" value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
                        </div>
                    </form>

                    <div className="lg:col-span-2">
                        <div className="bg-card border border-bdr rounded-2xl p-5 lg:sticky lg:top-20">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-lime mb-4">
                                <ShieldCheck size={14} /> Stock reserved for you
                            </div>
                            <div className="space-y-2 mb-4">
                                {items.map(i => (
                                    <div key={i.product.id} className="flex justify-between text-sm">
                                        <span className={`truncate mr-2 ${i.product.category === 'Cooked' ? 'text-orange-400' : 'text-t2'}`}>
                                            {i.product.category === 'Cooked' ? '🍜 ' : ''}{i.quantity}× {i.product.name}
                                        </span>
                                        <span className="font-semibold flex-shrink-0">{formatCurrency(i.product.selling_price * i.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-bdr mb-5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-t2">Total (Cash)</span>
                                    <span className="font-display font-bold text-xl text-lime">{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <button onClick={() => handleSubmit()} disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-lime text-[#000000] font-extrabold py-3.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40">
                                {loading ? <><Loader2 size={15} className="animate-spin" /> Placing...</>
                                    : <>Confirm Order <ArrowRight size={15} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />

            {/* ── Cooked Items Call Popup ── */}
            {cookedPopup && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
                    <div className="w-full max-w-sm rounded-2xl p-6 border-2 relative"
                        style={{ background: '#111110', borderColor: 'rgba(251,146,60,0.5)' }}>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{ boxShadow: '0 0 60px rgba(251,146,60,0.15) inset' }} />

                        <div className="text-center mb-5">
                            <div className="text-4xl mb-3">🍜</div>
                            <h2 className="font-display font-bold text-xl tracking-tight text-orange-400 mb-2">Order Placed!</h2>
                            <p className="text-sm text-t2 leading-relaxed">
                                Your order is reserved. For the <strong className="text-orange-400">cooked items</strong>, please call to confirm and arrange payment:
                            </p>
                        </div>

                        {/* Phone number highlight */}
                        <a href="tel:8570809208"
                            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl mb-4 font-extrabold text-xl tracking-wide active:scale-[0.97] transition-all"
                            style={{ background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '2px solid rgba(251,146,60,0.4)' }}>
                            <Phone size={20} className="animate-pulse" />
                            8570809208
                        </a>

                        {/* Cooked items list */}
                        {cookedItems.length > 0 && (
                            <div className="bg-card border border-bdr rounded-xl p-3 mb-4 space-y-1">
                                <p className="text-[10px] font-bold tracking-widest uppercase text-t3 mb-2">Your cooked items</p>
                                {cookedItems.map(i => (
                                    <div key={i.product.id} className="flex justify-between text-sm">
                                        <span className="text-t2">{i.quantity}× {i.product.name}</span>
                                        <span className="font-bold text-orange-400">{formatCurrency(i.product.selling_price * i.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-[11px] text-t3 text-center mb-4">
                            🕐 Call within 5 minutes to ensure your order is prepared
                        </p>

                        <button onClick={() => { setCookedPopup(false); router.push(pendingRedirect); }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-card border border-bdr hover:bg-card-hi transition-colors">
                            <X size={14} /> Got it, I&apos;ll call
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
