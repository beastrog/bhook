import { getDashboardStats, getProfitSplits, getHourlyTraffic } from '@/app/admin/actions';
import DashboardClient from './DashboardClient';

export const revalidate = 60;

export default async function DashboardPage() {
    const [stats, splits, traffic] = await Promise.all([
        getDashboardStats(),
        getProfitSplits(),
        getHourlyTraffic()
    ]);
    return <DashboardClient stats={stats} splits={splits} traffic={traffic} />;
}
