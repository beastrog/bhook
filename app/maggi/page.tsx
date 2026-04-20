import { getProducts } from '@/app/actions';
import MaggiClient from './MaggiClient';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const revalidate = 0; // opt out of caching so stock updates are real-time

export default async function MaggiPage() {
    const { data: products } = await getProducts();
    // Pass empty array if null
    return (
        <main className="bg-deep min-h-dvh">
            <Navbar />
            <MaggiClient products={products || []} />
            <BottomNav />
        </main>
    );
}
