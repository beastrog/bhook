'use client';

import { useState } from 'react';
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
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
            <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-16 md:pt-24">

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-white">Finalize.</h1>
                <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest mb-16">Enter physical destination parameters.</p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-16">

                    <div className="md:col-span-3">
                        <form onSubmit={handleSubmit} className="structural-panel p-8 md:p-10 space-y-8">

                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-4">Identity Header</label>
                                <input
                                    className={`input-minimal ${errors.customer_name ? 'border-red-500/50 text-red-400' : ''}`}
                                    placeholder="Student Name"
                                    value={form.customer_name}
                                    autoFocus
                                    onChange={(e) => { setForm({ ...form, customer_name: e.target.value }); setErrors({ ...errors, customer_name: '' }); }}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-4">Destination Node</label>
                                <input
                                    className={`input-minimal ${errors.room_number ? 'border-red-500/50 text-red-400' : ''}`}
                                    placeholder="Room E.g. G-204"
                                    value={form.room_number}
                                    onChange={(e) => { setForm({ ...form, room_number: e.target.value }); setErrors({ ...errors, room_number: '' }); }}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Comm Link</label>
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full">Optional</span>
                                </div>
                                <input
                                    className="input-minimal"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={form.phone_number}
                                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                />
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-2">
                        <div className="structural-panel p-8 sticky top-28">
                            <div className="flex items-center gap-3 text-[var(--accent)] mb-8">
                                <ShieldCheck size={20} />
                                <span className="text-xs font-bold uppercase tracking-widest font-mono">Locks Active (15m)</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {items.map(i => (
                                    <div key={i.product.id} className="flex justify-between items-baseline text-sm">
                                        <span className="text-zinc-400">
                                            <span className="text-white font-mono">{i.quantity}x</span> {i.product.name}
                                        </span>
                                        <span className="font-mono text-zinc-500">{formatCurrency(i.product.selling_price * i.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total (Cash)</span>
                                    <span className="text-3xl font-black font-mono text-white">{formatCurrency(total)}</span>
                                </div>

                                <button onClick={handleSubmit} disabled={loading} className="btn btn-primary w-full text-lg justify-between">
                                    <span>{loading ? 'Processing...' : 'Confirm Payload'}</span>
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
