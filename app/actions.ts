'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { PlaceOrderResponse } from '@/lib/types';
import { headers } from 'next/headers';
import { sendAdminPushNotification } from './admin/actions';

// ─── Place an order (calls DB stored procedure) ───────────────────────────────
export async function placeOrder(formData: {
    customer_name: string;
    room_number: string;
    phone_number?: string;
    items: { product_id: string; quantity: number }[];
}): Promise<{ data: PlaceOrderResponse | null; error: string | null }> {
    const supabase = await createClient();
    const headersList = await headers();
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    const ua = headersList.get('user-agent') || 'unknown';

    const { data, error } = await supabase.rpc('place_order', {
        p_customer_name: formData.customer_name,
        p_room_number: formData.room_number,
        p_phone_number: formData.phone_number || null,
        p_items: formData.items,
        p_ip_address: ip,
        p_user_agent: ua,
    });

    if (error) {
        // Extract clean error message from Postgres exception
        const msg = error.message?.replace('ERROR: ', '').split('\n')[0] || 'Failed to place order';
        return { data: null, error: msg };
    }

    const orderResponse = data as PlaceOrderResponse;

    // Background: Send Push Notification to Admins
    try {
        // Fetch item details to see if anything is "Cooked" for a special alert
        const { data: productDetails } = await supabase
            .from('products')
            .select('name, category')
            .in('id', formData.items.map(i => i.product_id));

        const hasCooked = productDetails?.some(p => p.category === 'Cooked');
        const itemsSummary = productDetails?.map(p => p.name).slice(0, 3).join(', ') + (productDetails && productDetails.length > 3 ? '...' : '');

        const title = hasCooked ? '🔥 NEW COOKED ORDER!' : '🛍️ New Order Received';
        const body = `${formData.customer_name} (Room ${formData.room_number}) ordered: ${itemsSummary}. Total: ₹${orderResponse.total_amount || '?'}`;

        // This is async but we don't need to wait for it before returning
        sendAdminPushNotification(title, body, `/admin/orders`);
    } catch (pushErr) {
        console.error('Failed to send admin push:', pushErr);
    }

    revalidatePath('/menu');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');

    return { data: orderResponse, error: null };
}

// ─── Get all active products ───────────────────────────────────────────────────
export async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('category')
        .order('name');
    return { data, error };
}

export async function getHotProducts() {
    const supabase = await createClient();
    const { data: items } = await supabase.from('order_items').select('product_id, quantity, orders!inner(status)').eq('orders.status', 'completed');
    const counts: Record<string, number> = {};
    if (items) {
        items.forEach(i => counts[i.product_id] = (counts[i.product_id] || 0) + i.quantity);
    }
    const { data: all } = await supabase.from('products').select('*').eq('active', true);
    if (!all) return { data: [] };
    return { data: all.sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)).slice(0, 3) };
}

// ─── Get single order with items ──────────────────────────────────────────────
export async function getOrder(orderId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();
    return { data, error };
}

// ─── Get store settings ───────────────────────────────────────────────────────
export async function getSettings() {
    const supabase = await createClient();
    const { data } = await supabase.from('settings').select('*');
    if (!data) return {};
    return Object.fromEntries(data.map((s) => [s.key, s.value]));
}
