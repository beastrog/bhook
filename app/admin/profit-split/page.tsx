import { getProfitSplits, getDashboardStats } from '@/app/admin/actions';
import ProfitSplitClient from './ProfitSplitClient';

export default async function ProfitSplitPage() {
    const [splits, stats] = await Promise.all([getProfitSplits(), getDashboardStats()]);
    return <ProfitSplitClient splits={splits} todayProfit={stats.dailyProfit} allTimeProfit={stats.totalProfit} />;
}
