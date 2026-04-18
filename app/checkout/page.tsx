'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
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

            // Save to recent
            useCartStore.getState().addOrder({
                id: data!.order_id,
                number: data!.order_number,
                total: data!.total_amount,
                date: new Date().toISOString(),
                status: 'reserved',
                items_count: items.reduce((acc, curr) => acc + curr.quantity, 0)
            });

            clearCart();
            router.push(`/order-success?id=${data!.order_id}&num=${data!.order_number}&total=${data!.total_amount}`);
        } catch { toast.error('Something went wrong'); }
        finally { setLoading(false); }
    };

    if (!items.length) {
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
                                        <span className="truncate mr-2 text-t2">{i.quantity}× {i.product.name}</span>
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
                                className="w-full flex items-center justify-center gap-2 bg-lime text-black font-extrabold py-3.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40">
                                {loading ? <><Loader2 size={15} className="animate-spin" /> Placing...</>
                                    : <>Confirm Order <ArrowRight size={15} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
