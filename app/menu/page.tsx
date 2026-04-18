import { getProducts } from '@/app/actions';
import MenuClient from './MenuClient';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const revalidate = 30;

export default async function MenuPage() {
    const { data: products } = await getProducts();
    return (
        <div className="min-h-dvh bg-deep">
            <Navbar />
            <MenuClient products={products || []} />
            <BottomNav />
        </div>
    );
}
