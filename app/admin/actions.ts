'use server';

import { createClient, createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function adminLoginOTP(email: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return { error: error.message };
    return { error: null };
}

export async function adminVerifyOTP(email: string, token: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) return { error: error.message };
    return { error: null };
}

export async function adminLogout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}

// ─── Products CRUD ────────────────────────────────────────────────────────────
export async function getAllProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category')
        .order('name');
    return { data, error };
}

export async function upsertProduct(product: {
    id?: string;
    name: string;
    description?: string;
    cost_price: number;
    selling_price: number;
    stock_quantity: number;
    category: string;
    active: boolean;
}) {
    const supabase = await createClient();
    const { error } = product.id
        ? await supabase.from('products').update(product).eq('id', product.id)
        : await supabase.from('products').insert(product);
    if (!error) revalidatePath('/admin/products');
    return { error: error?.message || null };
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) revalidatePath('/admin/products');
    return { error: error?.message || null };
}

export async function updateStock(productId: string, delta: number) {
    const supabase = await createClient();
    const { data: prod } = await supabase.from('products').select('stock_quantity').eq('id', productId).single();
    if (!prod) return { error: 'Product not found' };
    const newQty = Math.max(0, prod.stock_quantity + delta);
    const { error } = await supabase.from('products').update({ stock_quantity: newQty }).eq('id', productId);
    if (!error) revalidatePath('/admin/products');
    return { error: error?.message || null };
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getAllOrders(dateFilter?: string) {
    const supabase = await createClient();
    let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

    if (dateFilter) {
        const start = new Date(dateFilter);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateFilter);
        end.setHours(23, 59, 59, 999);
        query = query.gte('created_at', start.toISOString()).lte('created_at', end.toISOString());
    }

    const { data, error } = await query.limit(200);
    return { data, error };
}

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/analytics');
    }
    return { error: error?.message || null };
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export async function getDashboardStats() {
    const supabase = await createClient();
    const today = new Date();
    const start = new Date(today); start.setHours(0, 0, 0, 0);
    const end = new Date(today); end.setHours(23, 59, 59, 999);

    const { data: todayOrders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

    const { data: allProducts } = await supabase.from('products').select('*').order('stock_quantity');

    const { data: topItems } = await supabase
        .from('order_items')
        .select('product_name, quantity, line_total')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

    const completed = (todayOrders || []).filter((o) => o.status === 'completed');
    const pending = (todayOrders || []).filter((o) => ['reserved', 'pending_pickup'].includes(o.status));

    const totalRevenue = completed.reduce((s, o) => s + Number(o.total_amount), 0);
    const totalProfit = completed.reduce((s, o) => s + Number(o.total_profit), 0);
    const totalCost = completed.reduce((s, o) => s + Number(o.total_cost), 0);

    // Aggregate best sellers
    const sellerMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    (topItems || []).forEach((item) => {
        if (!sellerMap[item.product_name]) sellerMap[item.product_name] = { name: item.product_name, qty: 0, revenue: 0 };
        sellerMap[item.product_name].qty += item.quantity;
        sellerMap[item.product_name].revenue += Number(item.line_total);
    });
    const bestSellers = Object.values(sellerMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    return {
        totalOrders: (todayOrders || []).length,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        cancelledOrders: (todayOrders || []).filter((o) => o.status === 'cancelled').length,
        totalRevenue,
        totalCost,
        totalProfit,
        lowStockProducts: (allProducts || []).filter((p) => p.stock_quantity <= 5 && p.active),
        bestSellers,
    };
}

export async function getAnalytics(days = 7) {
    const supabase = await createClient();
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', start.toISOString())
        .order('created_at');

    return data || [];
}

// ─── Profit splits ────────────────────────────────────────────────────────────
export async function getProfitSplits() {
    const supabase = await createClient();
    const { data } = await supabase.from('profit_splits').select('*').eq('active', true).order('percentage', { ascending: false });
    return data || [];
}

export async function upsertProfitSplit(split: { id?: string; person_name: string; percentage: number }) {
    const supabase = await createClient();
    const { error } = split.id
        ? await supabase.from('profit_splits').update(split).eq('id', split.id)
        : await supabase.from('profit_splits').insert({ ...split, active: true });
    if (!error) revalidatePath('/admin/profit-split');
    return { error: error?.message || null };
}

export async function deleteProfitSplit(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('profit_splits').delete().eq('id', id);
    if (!error) revalidatePath('/admin/profit-split');
    return { error: error?.message || null };
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function updateSetting(key: string, value: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
    if (!error) revalidatePath('/admin/settings');
    return { error: error?.message || null };
}
