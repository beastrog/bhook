'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { placeOrder } from '@/app/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotal, clearCart } = useCartStore();
    const total = getTotal();
    const [form, setForm] = useState({ customer_name: '', room_number: '', phone_number: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.customer_name.trim()) e.customer_name = 'Required';
        if (!form.room_number.trim()) e.room_number = 'Required';
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        if (!items.length) { toast.error('Tray is empty'); return; }
        setLoading(true);
        try {
            const { data, error } = await placeOrder({
                customer_name: form.customer_name.trim(),
                room_number: form.room_number.trim(),
                phone_number: form.phone_number.trim() || undefined,
                items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
            });
            if (error) { toast.error(error); return; }
            clearCart();
            router.push(`/order-success?id=${data!.order_id}&num=${data!.order_number}&total=${data!.total_amount}`);
        } catch { toast.error('System exception'); }
        finally { setLoading(false); }
    };

    if (!items.length) return <div className="min-h-dvh relative z-10"><Navbar /></div>;

    return (
        <div className="min-h-dvh pb-32 relative z-10">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-10 md:pt-16">

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Finalize.</h1>
                <p className="text-zinc-400 font-medium mb-10">Provide pickup details to lock in your inventory.</p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

                    {/* Details Form */}
                    <div className="md:col-span-3">
                        <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">

                            <div>
                                <label className="text-sm font-bold text-zinc-300 block mb-3">What's your name?</label>
                                <input
                                    className={`input-glass ${errors.customer_name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                    placeholder="John Doe"
                                    value={form.customer_name}
                                    autoFocus
                                    onChange={(e) => { setForm({ ...form, customer_name: e.target.value }); setErrors({ ...errors, customer_name: '' }); }}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-zinc-300 block mb-3">Which room are you in?</label>
                                <input
                                    className={`input-glass ${errors.room_number ? 'border-red-500/50 bg-red-500/5' : ''}`}
                                    placeholder="e.g. G-204"
                                    value={form.room_number}
                                    onChange={(e) => { setForm({ ...form, room_number: e.target.value }); setErrors({ ...errors, room_number: '' }); }}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-bold text-zinc-300 block">Phone Number</label>
                                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full">Optional</span>
                                </div>
                                <input
                                    className="input-glass"
                                    type="tel"
                                    placeholder="98765 43210"
                                    value={form.phone_number}
                                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                />
                            </div>
                        </form>
                    </div>

                    {/* Checkout Summary */}
                    <div className="md:col-span-2">
                        <div className="glass-panel p-8 sticky top-24">
                            <div className="flex items-center gap-3 text-orange-500 mb-6">
                                <ShieldCheck size={24} />
                                <span className="font-bold">Stock locked for 15 mins</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {items.map(i => (
                                    <div key={i.product.id} className="flex justify-between text-sm">
                                        <span className="text-zinc-400">{i.quantity}x {i.product.name}</span>
                                        <span className="font-semibold">{formatCurrency(i.product.selling_price * i.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="font-bold text-zinc-300">Total (Cash)</span>
                                    <span className="text-3xl font-black">{formatCurrency(total)}</span>
                                </div>

                                <button onClick={handleSubmit} disabled={loading} className="btn btn-primary w-full text-lg shadow-[0_15px_40px_rgba(249,115,22,0.3)]">
                                    {loading ? <><Loader2 size={18} className="animate-spin mr-2" /> Processing</> : <><Check size={20} strokeWidth={3} className="mr-2" /> Confirm Order</>}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
