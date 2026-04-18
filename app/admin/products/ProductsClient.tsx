'use client';

import { useState, useTransition, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, ImagePlus, X, Loader2 } from 'lucide-react';
import { Product } from '@/lib/types';
import { upsertProduct, deleteProduct, updateStock, uploadProductImage } from '@/app/admin/actions';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = ['Chips', 'Noodles', 'Chocolates', 'Drinks', 'Biscuits', 'Others'];
const EMPTY_FORM = { name: '', description: '', cost_price: 0, selling_price: 0, stock_quantity: 10, category: 'Chips', active: true, image_url: '' };
const catEmoji: Record<string, string> = { Chips: '🍟', Noodles: '🍜', Chocolates: '🍫', Drinks: '🥤', Biscuits: '🍪' };

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (p: Product) => {
        setEditProduct(p);
        setForm({ name: p.name, description: p.description || '', cost_price: p.cost_price, selling_price: p.selling_price, stock_quantity: p.stock_quantity, category: p.category, active: p.active, image_url: p.image_url || '' });
        setShowModal(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('productId', editProduct?.id || 'new-' + Date.now());
        try {
            const { url, error } = await uploadProductImage(fd);
            if (error) { toast.error(error); return; }
            if (url) { setForm(f => ({ ...f, image_url: url })); toast.success('Image uploaded'); }
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
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
            toast.success('Deleted');
            setProducts(prev => prev.filter(p => p.id !== id));
        });
    };

    const handleStock = async (id: string, delta: number) => {
        startTransition(async () => {
            const { error } = await updateStock(id, delta);
            if (error) { toast.error(error); return; }
            setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_quantity: Math.max(0, p.stock_quantity + delta) } : p));
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-24">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-t3 mb-0.5">Inventory</p>
                    <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight">Products</h1>
                    <p className="text-[11px] text-t3">{products.length} items</p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-1.5 bg-lime text-deep font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97]">
                    <Plus size={15} /> Add
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
                {products.map(p => (
                    <motion.div key={p.id} layout className="bg-card border border-bdr rounded-2xl p-3.5">
                        <div className="flex items-start gap-3">
                            {p.image_url ? (
                                <img src={p.image_url} alt={p.name} className="w-11 h-11 rounded-lg object-cover flex-shrink-0 bg-elev" />
                            ) : (
                                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-lg flex-shrink-0 bg-card-hi">
                                    {catEmoji[p.category] || '🍿'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h3 className="font-semibold text-sm truncate">{p.name}</h3>
                                    {!p.active && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-err/10 text-err flex-shrink-0">Hidden</span>}
                                </div>
                                <div className="flex items-center gap-2.5 text-[11px] text-t3">
                                    <span>Cost: <strong className="text-t1">{formatCurrency(p.cost_price)}</strong></span>
                                    <span>Sell: <strong className="text-lime">{formatCurrency(p.selling_price)}</strong></span>
                                    <span className="text-ok">+{formatCurrency(p.selling_price - p.cost_price)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <button onClick={() => handleStock(p.id, -1)} className="w-6 h-6 rounded-md flex items-center justify-center bg-card-hi text-t2">
                                        <ChevronDown size={12} />
                                    </button>
                                    <span className={`font-bold text-xs min-w-[2rem] text-center ${p.stock_quantity <= 3 ? 'text-err' : p.stock_quantity <= 10 ? 'text-warn' : 'text-t1'}`}>
                                        {p.stock_quantity}
                                    </span>
                                    <button onClick={() => handleStock(p.id, 1)} className="w-6 h-6 rounded-md flex items-center justify-center bg-lime text-deep">
                                        <ChevronUp size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-lime/8 text-lime hover:bg-lime/15 transition-colors">
                                    <Edit2 size={13} />
                                </button>
                                <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg bg-err/8 text-err hover:bg-err/15 transition-colors">
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
                        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="w-full max-w-lg bg-card border border-bdr rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto">
                            <div className="w-10 h-1 rounded-full mx-auto mb-4 bg-elev sm:hidden" />
                            <h2 className="font-display font-bold text-lg mb-4">{editProduct ? 'Edit Product' : 'New Product'}</h2>
                            <div className="space-y-3.5">
                                {/* Image */}
                                <div>
                                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Image</label>
                                    <div className="flex items-center gap-3">
                                        {form.image_url ? (
                                            <div className="relative">
                                                <img src={form.image_url} alt="" className="w-14 h-14 rounded-xl object-cover" />
                                                <button onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-err text-white flex items-center justify-center">
                                                    <X size={8} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => fileRef.current?.click()} disabled={uploading}
                                                className="w-14 h-14 rounded-xl border-2 border-dashed border-bdr-hi flex items-center justify-center text-t3 hover:text-lime hover:border-lime/30 transition-colors">
                                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={18} />}
                                            </button>
                                        )}
                                        <p className="text-[11px] text-t3">Max 2MB · JPG, PNG, WebP</p>
                                    </div>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </div>

                                <input placeholder="Product name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors" />
                                <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none placeholder:text-t3 focus:border-lime/40 transition-colors" />
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="text-[10px] text-t3 mb-1 block">Cost (₹)</label>
                                        <input type="number" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: +e.target.value })}
                                            className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none focus:border-lime/40 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-lime mb-1 block">Sell (₹)</label>
                                        <input type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: +e.target.value })}
                                            className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none focus:border-lime/40 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-t3 mb-1 block">Stock</label>
                                    <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: +e.target.value })}
                                        className="w-full bg-deep border border-bdr rounded-xl px-4 py-3 text-sm outline-none focus:border-lime/40 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold tracking-[0.12em] uppercase text-t3 mb-2">Category</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {CATEGORIES.map(c => (
                                            <button key={c} onClick={() => setForm({ ...form, category: c })}
                                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${form.category === c
                                                        ? 'bg-lime text-deep border-lime'
                                                        : 'bg-transparent text-t3 border-bdr hover:border-bdr-hi'
                                                    }`}>{c}</button>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setForm({ ...form, active: !form.active })}>
                                    <div className={`w-10 h-5 rounded-full relative transition-all ${form.active ? 'bg-lime' : 'bg-card-hi'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${form.active ? 'left-[22px]' : 'left-[2px]'}`} />
                                    </div>
                                    <span className="text-sm">Visible to customers</span>
                                </label>
                                {form.selling_price > 0 && form.cost_price > 0 && (
                                    <p className="text-sm text-ok">
                                        Profit: {formatCurrency(form.selling_price - form.cost_price)}/unit ({Math.round(((form.selling_price - form.cost_price) / form.selling_price) * 100)}%)
                                    </p>
                                )}
                                <button onClick={handleSave} disabled={isPending}
                                    className="w-full bg-lime text-deep font-extrabold py-3.5 rounded-xl hover:shadow-[0_4px_20px_rgba(200,255,0,0.2)] transition-all active:scale-[0.97] disabled:opacity-40">
                                    {isPending ? 'Saving...' : editProduct ? 'Update' : 'Add Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
