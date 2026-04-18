import { getDashboardStats, getProfitSplits } from '@/app/admin/actions';
import DashboardClient from './DashboardClient';
import { adminLogout } from '@/app/admin/actions';

export const revalidate = 60;

export default async function DashboardPage() {
    const [stats, splits] = await Promise.all([getDashboardStats(), getProfitSplits()]);
    return <DashboardClient stats={stats} splits={splits} />;
}
