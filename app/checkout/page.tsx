'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
            clearCart();
            router.push(`/order-success?id=${data!.order_id}&num=${data!.order_number}&total=${data!.total_amount}`);
        } catch { toast.error('Something went wrong'); }
        finally { setLoading(false); }
    };

    if (!items.length) {
        return <div className="min-h-dvh bg-black"><Navbar /></div>;
    }

    return (
        <div className="min-h-dvh bg-black pb-32">
            <Navbar />
            <div className="max-w-xl mx-auto px-6 pt-6">

                <h1 className="title-medium mb-1">Checkout.</h1>
                <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Provide your details for pickup.</p>

                {/* Minimal strict forms */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-6 pt-2 pb-6 border-y border-[var(--border-subtle)]">
                        <div>
                            <label className="text-overline mb-2 block">Name</label>
                            <input
                                className="input focus:border-[var(--text-primary)]"
                                placeholder="Full name"
                                value={form.customer_name}
                                autoFocus
                                onChange={(e) => { setForm({ ...form, customer_name: e.target.value }); setErrors({ ...errors, customer_name: '' }); }}
                            />
                            {errors.customer_name && <p className="text-xs mt-2 text-[var(--red)] font-bold">{errors.customer_name}</p>}
                        </div>

                        <div>
                            <label className="text-overline mb-2 block">Room</label>
                            <input
                                className="input focus:border-[var(--text-primary)]"
                                placeholder="e.g. G-204"
                                value={form.room_number}
                                onChange={(e) => { setForm({ ...form, room_number: e.target.value }); setErrors({ ...errors, room_number: '' }); }}
                            />
                            {errors.room_number && <p className="text-xs mt-2 text-[var(--red)] font-bold">{errors.room_number}</p>}
                        </div>

                        <div>
                            <label className="text-overline mb-2 flex items-center justify-between">
                                <span>Phone Number</span>
                                <span className="text-[var(--text-tertiary)] lowercase">optional</span>
                            </label>
                            <input
                                className="input focus:border-[var(--text-primary)]"
                                type="tel"
                                placeholder="98765 43210"
                                value={form.phone_number}
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-4">
                        <span className="font-bold">Total to pay (Cash)</span>
                        <span className="title-medium">{formatCurrency(total)}</span>
                    </div>

                </form>
            </div>

            <div className="fixed bottom-6 left-6 right-6 z-50 max-w-xl mx-auto">
                <button onClick={handleSubmit} disabled={loading}
                    className="btn btn-accent w-full text-center shadow-[0_0_40px_rgba(226,254,83,0.15)] font-black uppercase tracking-wider text-sm">
                    {loading ? <><Loader2 size={16} className="animate-spin mr-2" /> Processing...</> : `Confirm Reservation`}
                </button>
            </div>
        </div>
    );
}
