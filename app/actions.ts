'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { PlaceOrderResponse } from '@/lib/types';

// ─── Place an order (calls DB stored procedure) ───────────────────────────────
export async function placeOrder(formData: {
    customer_name: string;
    room_number: string;
    phone_number?: string;
    items: { product_id: string; quantity: number }[];
}): Promise<{ data: PlaceOrderResponse | null; error: string | null }> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('place_order', {
        p_customer_name: formData.customer_name,
        p_room_number: formData.room_number,
        p_phone_number: formData.phone_number || null,
        p_items: formData.items,
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
