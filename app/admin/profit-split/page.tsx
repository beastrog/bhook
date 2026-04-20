import { getProfitSplits, getDashboardStats, getCookedProfitSplits, getCookedStats } from '@/app/admin/actions';
import ProfitSplitClient from './ProfitSplitClient';

export default async function ProfitSplitPage() {
    const [splits, stats, cookedSplits, cookedStats] = await Promise.all([getProfitSplits(), getDashboardStats(), getCookedProfitSplits(), getCookedStats()]);

    // Subtract cooked profits from general profits
    const generalTodayProfit = stats.dailyProfit - cookedStats.todayProfit;
    const generalAllTimeProfit = stats.totalProfit - cookedStats.allTimeProfit;

    return <ProfitSplitClient
        splits={splits}
        todayProfit={generalTodayProfit}
        allTimeProfit={generalAllTimeProfit}
        cookedSplits={cookedSplits}
        cookedTodayProfit={cookedStats.todayProfit}
        cookedAllTimeProfit={cookedStats.allTimeProfit}
    />;
}
