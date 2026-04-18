import { getAllProducts } from '@/app/admin/actions';
import ProductsClient from './ProductsClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
    const { data: products } = await getAllProducts();
    return <ProductsClient initialProducts={products || []} />;
}
