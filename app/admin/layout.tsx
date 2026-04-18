import { cookies } from 'next/headers';
import AdminNav from '@/components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('bhook_admin_auth')?.value === 'true';

    return (
        <div className="min-h-dvh bg-deep pb-20">
            {children}
            {isAdmin && <AdminNav />}
        </div>
    );
}
