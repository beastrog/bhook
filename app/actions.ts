'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { PlaceOrderResponse } from '@/lib/types';

import { headers } from 'next/headers';

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

    revalidatePath('/menu');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');

    return { data: data as PlaceOrderResponse, error: null };
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
