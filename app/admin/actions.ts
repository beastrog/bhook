'use server';

import { createClient, createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import webpush from 'web-push';

// Configure web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_EMAIL) {
    webpush.setVapidDetails(
        process.env.VAPID_EMAIL,
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_EMAIL) {
    webpush.setVapidDetails(
        process.env.VAPID_EMAIL,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

// Helper to verify admin
async function verifyAdmin() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('bhook_admin_auth')?.value === 'true';
    if (!isAdmin) throw new Error('Unauthorized');
    // Using service client because we haven't defined RLS policies for admin writes.
    return createServiceClient();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function adminLoginEmail(email: string, passcode: string) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (adminEmails.length > 0 && !adminEmails.includes(email.trim())) {
        return { error: 'Unauthorized email address' };
    }

    const masterPasscode = process.env.ADMIN_PASSCODE || '1234';
    if (passcode !== masterPasscode) {
        return { error: 'Invalid admin passcode' };
    }

    const cookieStore = await cookies();
    cookieStore.set('bhook_admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return { error: null };
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('bhook_admin_auth');
    redirect('/admin/login');
}

// ─── Products CRUD ────────────────────────────────────────────────────────────
export async function getAllProducts() {
    // Reads don't necessarily bypass RLS, but for admin we might want to see inactive products too
    const adminClient = await verifyAdmin();
    const { data, error } = await adminClient
        .from('products')
        .select('*')
        .order('category')
        .order('name');
    return { data, error };
}

export async function upsertProduct(product: any) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = product.id
            ? await adminClient.from('products').update(product).eq('id', product.id)
            : await adminClient.from('products').insert(product);
        if (!error) revalidatePath('/admin/products');
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

export async function deleteProduct(id: string) {
    const supabase = await verifyAdmin();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/admin/products');
    return { error: null };
}

export async function resetAppData() {
    const supabase = await verifyAdmin();

    // Step 1: Fetch all non-cancelled orders with their items so we can restore stock
    const { data: orders } = await supabase
        .from('orders')
        .select('id, status, order_items(product_id, quantity)')
        .neq('status', 'cancelled'); // cancelled orders already had stock restored by trigger

    // Step 2: Restore stock for all reserved/completed orders
    if (orders && orders.length > 0) {
        const stockMap: Record<string, number> = {};
        for (const order of orders) {
            for (const item of (order as any).order_items || []) {
                stockMap[item.product_id] = (stockMap[item.product_id] || 0) + item.quantity;
            }
        }
        for (const [productId, qty] of Object.entries(stockMap)) {
            const { data: prod } = await supabase.from('products').select('stock_quantity').eq('id', productId).single();
            if (prod) {
                await supabase.from('products').update({ stock_quantity: prod.stock_quantity + qty }).eq('id', productId);
            }
        }
    }

    // Step 3: Delete all orders (CASCADE deletes order_items too)
    const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) return { error: error.message };

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/analytics');
    revalidatePath('/admin/profit-split');
    return { error: null };
}

export async function updateStock(productId: string, delta: number) {
    try {
        const adminClient = await verifyAdmin();
        const { data: prod } = await adminClient.from('products').select('stock_quantity').eq('id', productId).single();
        if (!prod) return { error: 'Product not found' };

        const newQty = Math.max(0, prod.stock_quantity + delta);
        const { error } = await adminClient.from('products').update({ stock_quantity: newQty }).eq('id', productId);
        if (!error) revalidatePath('/admin/products');
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getAllOrders(dateFilter?: string) {
    const adminClient = await verifyAdmin();
    let query = adminClient
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

    const { data, error } = await query.limit(500);
    return { data, error };
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = await adminClient.from('orders').update({ status }).eq('id', orderId);
        if (!error) {
            revalidatePath('/admin/orders');
            revalidatePath('/admin/dashboard');
            revalidatePath('/admin/analytics');
        }
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

export async function deleteOrder(orderId: string) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = await adminClient.from('orders').delete().eq('id', orderId);
        if (!error) {
            revalidatePath('/admin/orders');
            revalidatePath('/admin/dashboard');
        }
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export async function getDashboardStats() {
    const adminClient = await verifyAdmin();
    const today = new Date();
    const start = new Date(today); start.setHours(0, 0, 0, 0);
    const end = new Date(today); end.setHours(23, 59, 59, 999);

    // Fetch today's orders
    const { data: todayOrders } = await adminClient
        .from('orders').select('*')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

    // Fetch ALL-TIME orders (completed)
    const { data: allOrders } = await adminClient
        .from('orders').select('*')
        .eq('status', 'completed');

    const { data: allProducts } = await adminClient.from('products').select('*').order('stock_quantity');

    // All-time top sellers from order_items
    const { data: topItems } = await adminClient
        .from('order_items').select('product_name, quantity, line_total');

    const completed = (todayOrders || []).filter((o) => o.status === 'completed');
    const pending = (todayOrders || []).filter((o) => ['reserved', 'pending_pickup'].includes(o.status));

    // Daily stats
    const dailyRevenue = completed.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const dailyProfit = completed.reduce((s, o) => s + Number(o.total_profit || 0), 0);
    const dailyCost = completed.reduce((s, o) => s + Number(o.total_cost || 0), 0);

    // All-time stats
    const allCompleted = (allOrders || []);
    const totalRevenue = allCompleted.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const totalProfit = allCompleted.reduce((s, o) => s + Number(o.total_profit || 0), 0);
    const totalCost = allCompleted.reduce((s, o) => s + Number(o.total_cost || 0), 0);

    const sellerMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    (topItems || []).forEach((item) => {
        if (!sellerMap[item.product_name]) sellerMap[item.product_name] = { name: item.product_name, qty: 0, revenue: 0 };
        sellerMap[item.product_name].qty += item.quantity;
        sellerMap[item.product_name].revenue += Number(item.line_total || 0);
    });
    const bestSellers = Object.values(sellerMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

    return {
        // Daily
        dailyOrders: (todayOrders || []).length,
        dailyCompleted: completed.length,
        dailyPending: pending.length,
        dailyCancelled: (todayOrders || []).filter((o) => o.status === 'cancelled').length,
        dailyRevenue,
        dailyCost,
        dailyProfit,
        // All-time
        totalOrders: allCompleted.length,
        completedOrders: allCompleted.length,
        pendingOrders: pending.length,
        cancelledOrders: (todayOrders || []).filter((o) => o.status === 'cancelled').length,
        totalRevenue,
        totalCost,
        totalProfit,
        // Shared
        lowStockProducts: (allProducts || []).filter((p) => p.stock_quantity <= 5 && p.active),
        bestSellers,
    };
}

export async function getAnalytics(days = 7) {
    const adminClient = await verifyAdmin();
    const start = new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);

    const { data } = await adminClient
        .from('orders')
        .select('*')
        .eq('status', 'completed')
        .gte('created_at', start.toISOString())
        .order('created_at');

    return data || [];
}

// ─── Profit splits ────────────────────────────────────────────────────────────
export async function getProfitSplits() {
    const adminClient = await verifyAdmin();
    const { data } = await adminClient.from('profit_splits').select('*').eq('active', true).order('percentage', { ascending: false });
    return data || [];
}

export async function upsertProfitSplit(split: any) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = split.id
            ? await adminClient.from('profit_splits').update(split).eq('id', split.id)
            : await adminClient.from('profit_splits').insert({ ...split, active: true });
        if (!error) revalidatePath('/admin/profit-split');
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

export async function deleteProfitSplit(id: string) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = await adminClient.from('profit_splits').delete().eq('id', id);
        if (!error) revalidatePath('/admin/profit-split');
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
export async function uploadProductImage(formData: FormData): Promise<{ url: string | null; error: string | null }> {
    try {
        const adminClient = await verifyAdmin();
        const file = formData.get('file') as File;
        if (!file) return { url: null, error: 'No file provided' };

        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        if (!allowed.includes(ext)) return { url: null, error: 'Invalid file type' };

        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = `products/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await adminClient.storage
            .from('product-images')
            .upload(filePath, arrayBuffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) return { url: null, error: uploadError.message };

        const { data: { publicUrl } } = adminClient.storage.from('product-images').getPublicUrl(filePath);
        return { url: publicUrl, error: null };
    } catch (e: any) { return { url: null, error: e.message }; }
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export async function updateSetting(key: string, value: string) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = await adminClient.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
        if (!error) {
            revalidatePath('/admin/settings');
            revalidatePath('/', 'layout'); // Revalidate everything to reflect store status
        }
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

// ─── Cooked Profit Splits ─────────────────────────────────────────────────────
export async function getCookedProfitSplits() {
    const adminClient = await verifyAdmin();
    const { data } = await adminClient.from('cooked_profit_splits').select('*').eq('active', true).order('percentage', { ascending: false });
    return data || [];
}

export async function upsertCookedProfitSplit(split: any) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = split.id
            ? await adminClient.from('cooked_profit_splits').update(split).eq('id', split.id)
            : await adminClient.from('cooked_profit_splits').insert({ ...split, active: true });
        if (!error) revalidatePath('/admin/profit-split');
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

export async function deleteCookedProfitSplit(id: string) {
    try {
        const adminClient = await verifyAdmin();
        const { error } = await adminClient.from('cooked_profit_splits').delete().eq('id', id);
        if (!error) revalidatePath('/admin/profit-split');
        return { error: error?.message || null };
    } catch (e: any) { return { error: e.message }; }
}

// Get cooked-item profits from order_items (items whose product category is 'Cooked')
export async function getCookedStats() {
    const adminClient = await verifyAdmin();
    const today = new Date();
    const startOfDay = new Date(today); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today); endOfDay.setHours(23, 59, 59, 999);

    // Get all order_items for Cooked products (join products to check category)
    const { data: allCookedItems } = await adminClient
        .from('order_items')
        .select('line_total, line_cost, line_profit, created_at, orders!inner(status)')
        .eq('orders.status', 'completed');

    // Filter cooked items by checking product names — we identify Cooked via product_name lookup
    // Better: join through products table to check category
    const { data: cookedProducts } = await adminClient
        .from('products').select('id, name').eq('category', 'Cooked');
    const cookedProductNames = new Set((cookedProducts || []).map(p => p.name));

    const { data: allCookedOrderItems } = await adminClient
        .from('order_items')
        .select('line_total, line_cost, line_profit, created_at, orders!inner(status)')
        .in('product_name', cookedProductNames.size > 0 ? [...cookedProductNames] : ['__none__'])
        .eq('orders.status', 'completed');

    const items = allCookedOrderItems || [];
    const todayItems = items.filter(i => {
        const d = new Date(i.created_at);
        return d >= startOfDay && d <= endOfDay;
    });

    return {
        allTimeRevenue: items.reduce((s, i) => s + Number(i.line_total || 0), 0),
        allTimeProfit: items.reduce((s, i) => s + Number(i.line_profit || 0), 0),
        allTimeCost: items.reduce((s, i) => s + Number(i.line_cost || 0), 0),
        allTimeOrders: items.length,
        todayRevenue: todayItems.reduce((s, i) => s + Number(i.line_total || 0), 0),
        todayProfit: todayItems.reduce((s, i) => s + Number(i.line_profit || 0), 0),
        todayCost: todayItems.reduce((s, i) => s + Number(i.line_cost || 0), 0),
    };
}

// ─── Push Notifications ────────────────────────────────────────────────────────
export async function subscribeAdmin(subscription: any) {
    try {
        const supabase = await createServiceClient(); // Shared across sessions for push
        const { error } = await supabase
            .from('admin_push_subscriptions')
            .upsert({
                admin_id: 'default_admin',
                subscription,
                endpoint: subscription.endpoint
            }, { onConflict: 'endpoint' });

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function unsubscribeAdmin(endpoint: string) {
    try {
        const supabase = await createServiceClient();
        const { error } = await supabase
            .from('admin_push_subscriptions')
            .delete()
            .match({ 'subscription->>endpoint': endpoint });

        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function checkSubscription(endpoint: string) {
    try {
        const supabase = await createServiceClient();
        const { data } = await supabase
            .from('admin_push_subscriptions')
            .select('*')
            .match({ 'subscription->>endpoint': endpoint })
            .single();

        return !!data;
    } catch {
        return false;
    }
}

export async function sendAdminPushNotification(title: string, body: string, url: string = '/admin/orders') {
    try {
        const supabase = await createServiceClient();
        const { data: subs } = await supabase.from('admin_push_subscriptions').select('subscription');

        if (!subs || subs.length === 0) return;

        const payload = JSON.stringify({ title, body, url });

        const promises = subs.map((sub: any) =>
            webpush.sendNotification(sub.subscription, payload)
                .catch(err => {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        console.log('Push subscription expired, cleanup needed');
                    }
                    console.error('Push error:', err);
                })
        );

        await Promise.all(promises);
    } catch (error) {
        console.error('Global push error:', error);
    }
}
