'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { Product } from '@/lib/types';
import { upsertProduct, deleteProduct, updateStock } from '@/app/admin/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = ['Chips', 'Noodles', 'Chocolates', 'Drinks', 'Biscuits', 'Others'];
const EMPTY_FORM = { name: '', description: '', cost_price: 0, selling_price: 0, stock_quantity: 10, category: 'Chips', active: true };

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isPending, startTransition] = useTransition();

    const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (p: Product) => {
        setEditProduct(p);
        setForm({ name: p.name, description: p.description || '', cost_price: p.cost_price, selling_price: p.selling_price, stock_quantity: p.stock_quantity, category: p.category, active: p.active });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) { toast.error('Name is required'); return; }
        startTransition(async () => {
            const { error } = await upsertProduct({ ...(editProduct ? { id: editProduct.id } : {}), ...form });
            if (error) { toast.error(error); return; }
            toast.success(editProduct ? 'Product updated!' : 'Product added!');
            setShowModal(false);
            window.location.reload();
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        startTransition(async () => {
            const { error } = await deleteProduct(id);
            if (error) { toast.error(error); return; }
            toast.success('Product deleted');
            setProducts((prev) => prev.filter((p) => p.id !== id));
        });
    };

    const handleStock = async (id: string, delta: number) => {
        startTransition(async () => {
            const { error } = await updateStock(id, delta);
            if (error) { toast.error(error); return; }
            setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock_quantity: Math.max(0, p.stock_quantity + delta) } : p));
        });
    };

    return (
        <div className="px-5 pt-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl font-black" style={{ color: 'var(--on-surface)' }}>Products</h1>
                    <p className="text-sm" style={{ color: 'var(--on-surface-muted)' }}>{products.length} items</p>
                </div>
                <button onClick={openAdd} className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold">
                    <Plus size={16} /> Add Item
                </button>
            </div>

            {/* Products list */}
            <div className="space-y-3">
                {products.map((p) => (
                    <motion.div key={p.id} layout className="glass rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'var(--bg-low)' }}>
                                {getCatEmoji(p.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-bold text-sm truncate" style={{ color: 'var(--on-surface)' }}>{p.name}</h3>
                                    {!p.active && <span className="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,110,132,0.1)', color: '#ff6e84' }}>Hidden</span>}
                                </div>
                                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--on-surface-muted)' }}>
                                    <span>Cost: <strong style={{ color: 'var(--on-surface)' }}>{formatCurrency(p.cost_price)}</strong></span>
                                    <span>Sell: <strong style={{ color: 'var(--secondary)' }}>{formatCurrency(p.selling_price)}</strong></span>
                                    <span style={{ color: '#5bf083' }}>+{formatCurrency(p.selling_price - p.cost_price)}</span>
                                </div>
                                {/* Stock controls */}
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => handleStock(p.id, -1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)' }}>
                                        <ChevronDown size={12} />
                                    </button>
                                    <span className={`font-bold text-sm ${p.stock_quantity <= 3 ? 'text-red-400' : p.stock_quantity <= 10 ? 'text-amber-400' : ''}`} style={p.stock_quantity > 10 ? { color: 'var(--on-surface)' } : {}}>
                                        {p.stock_quantity} left
                                    </span>
                                    <button onClick={() => handleStock(p.id, 1)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ba9eff, #8455ef)', color: '#000' }}>
                                        <ChevronUp size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg" style={{ background: 'rgba(186,158,255,0.1)', color: 'var(--primary)' }}>
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,110,132,0.1)', color: '#ff6e84' }}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center px-0"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="w-full max-w-lg rounded-t-3xl p-6 pb-safe max-h-[85vh] overflow-y-auto"
                            style={{ background: 'var(--bg-card)', border: '1px solid rgba(69,72,82,0.4)' }}
                        >
                            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--outline)' }} />
                            <h2 className="font-black text-lg mb-5" style={{ color: 'var(--on-surface)' }}>
                                {editProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <div className="space-y-4">
                                <input placeholder="Product name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                                <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs mb-1 block" style={{ color: 'var(--on-surface-muted)' }}>Cost Price (₹)</label>
                                        <input type="number" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: +e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                                    </div>
                                    <div>
                                        <label className="text-xs mb-1 block" style={{ color: 'var(--secondary)' }}>Selling Price (₹)</label>
                                        <input type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: +e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs mb-1 block" style={{ color: 'var(--on-surface-muted)' }}>Stock Quantity</label>
                                    <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: +e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ background: 'var(--bg-card-high)', color: 'var(--on-surface)', border: '1px solid rgba(69,72,82,0.4)' }} />
                                </div>
                                <div>
                                    <label className="text-xs mb-2 block" style={{ color: 'var(--on-surface-muted)' }}>Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CATEGORIES.map((c) => (
                                            <button key={c} onClick={() => setForm({ ...form, category: c })}
                                                className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
                                                style={form.category === c ? { background: 'linear-gradient(135deg, #ba9eff, #8455ef)', color: '#000' } : { background: 'var(--bg-card-high)', color: 'var(--on-surface-muted)' }}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div
                                        className="w-12 h-6 rounded-full transition-all relative"
                                        style={{ background: form.active ? 'linear-gradient(135deg, #ba9eff, #8455ef)' : 'var(--bg-card-high)' }}
                                        onClick={() => setForm({ ...form, active: !form.active })}
                                    >
                                        <div className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ left: form.active ? '28px' : '4px' }} />
                                    </div>
                                    <span className="text-sm" style={{ color: 'var(--on-surface)' }}>Visible to customers</span>
                                </label>
                                {form.selling_price > 0 && form.cost_price > 0 && (
                                    <p className="text-sm" style={{ color: '#5bf083' }}>
                                        Profit per unit: {formatCurrency(form.selling_price - form.cost_price)} ({Math.round(((form.selling_price - form.cost_price) / form.selling_price) * 100)}% margin)
                                    </p>
                                )}
                                <button onClick={handleSave} disabled={isPending} className="btn-primary w-full py-3.5 rounded-xl font-bold">
                                    {isPending ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function getCatEmoji(c: string) {
    return { Chips: '🍟', Noodles: '🍜', Chocolates: '🍫', Drinks: '🥤', Biscuits: '🍪' }[c] || '🍿';
}
