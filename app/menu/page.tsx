import { getProducts } from '@/app/actions';
import MenuClient from './MenuClient';
import Navbar from '@/components/Navbar';

export const revalidate = 30; // revalidate every 30s

export default async function MenuPage() {
    const { data: products } = await getProducts();

    return (
        <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
            <Navbar />
            <MenuClient products={products || []} />
        </div>
    );
}
