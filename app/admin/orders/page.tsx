import { getAllOrders } from '@/app/admin/actions';
import OrdersClient from './OrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
    const params = await searchParams;
    const { data: orders } = await getAllOrders(params.date);
    return <OrdersClient initialOrders={orders || []} defaultDate={params.date} />;
}
