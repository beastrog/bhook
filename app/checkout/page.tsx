'use client';

import { useState } from 'react';
import { Loader2, ArrowLeft, User, DoorOpen, Phone } from 'lucide-react';
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

    if (!items.length) return (
        <div className="min-h-dvh flex items-center justify-center" style={{ background: 'var(--bg)' }}>
            <div className="text-center px-5">
                <p className="text-4xl mb-4">🛒</p>
                <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Cart is empty</p>
                <Link href="/menu" className="btn btn-orange-pill">Browse Menu</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-dvh pb-36" style={{ background: 'var(--bg)' }}>
            <Navbar />
            <div className="max-w-lg mx-auto px-5 pt-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/cart" className="btn btn-icon"><ArrowLeft size={16} /></Link>
                    <div>
                        <h1 className="font-black text-xl" style={{ letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Reserve</h1>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Tell us who you are</p>
                    </div>
                </div>

                {/* How it works note */}
                <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>How pickup works</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Reserve now → come to our room → pay <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(total)} cash</strong> → collect snacks
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-label mb-2 block flex items-center gap-1.5">
                            <User size={11} /> Your Name *
                        </label>
                        <input
                            className={`input ${errors.customer_name ? 'input-error' : ''}`}
                            placeholder="e.g. Rahul Sharma"
                            value={form.customer_name}
                            onChange={(e) => { setForm({ ...form, customer_name: e.target.value }); setErrors({ ...errors, customer_name: '' }); }}
                        />
                        {errors.customer_name && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.customer_name}</p>}
                    </div>

                    <div>
                        <label className="text-label mb-2 block flex items-center gap-1.5">
                            <DoorOpen size={11} /> Room Number *
                        </label>
                        <input
                            className={`input ${errors.room_number ? 'input-error' : ''}`}
                            placeholder="e.g. G-204"
                            value={form.room_number}
                            onChange={(e) => { setForm({ ...form, room_number: e.target.value }); setErrors({ ...errors, room_number: '' }); }}
                        />
                        {errors.room_number && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.room_number}</p>}
                    </div>

                    <div>
                        <label className="text-label mb-2 block flex items-center gap-1.5">
                            <Phone size={11} /> Phone <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 'normal', fontSize: '11px' }}>(optional)</span>
                        </label>
                        <input
                            className="input"
                            type="tel"
                            placeholder="9876543210"
                            value={form.phone_number}
                            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                        />
                    </div>

                    {/* Summary */}
                    <div className="card p-4" style={{ borderRadius: '14px' }}>
                        <p className="text-label mb-3">Order</p>
                        {items.map((item) => (
                            <div key={item.product.id} className="flex justify-between text-sm mb-1.5">
                                <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} × {item.quantity}</span>
                                <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(item.product.selling_price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="sep mt-2 mb-2" />
                        <div className="flex justify-between">
                            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Total to pay</span>
                            <span className="font-black text-base" style={{ color: 'var(--accent)' }}>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </form>
            </div>

            {/* Fixed bottom */}
            <div className="fixed bottom-0 left-0 right-0 pb-safe px-5 py-4"
                style={{ background: 'var(--bg)', borderTop: '1px solid var(--border-subtle)' }}>
                <button onClick={handleSubmit} disabled={loading}
                    className="btn btn-orange-pill w-full flex justify-center py-4">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Placing…</> : `Place Reservation →`}
                </button>
            </div>
        </div>
    );
}
