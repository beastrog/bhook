import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-dvh pb-20 bg-[var(--background)]">
            {children}
            {user && <AdminNav />}
        </div>
    );
}
