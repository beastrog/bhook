import { getAnalytics, getProfitSplits } from '@/app/admin/actions';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage() {
    const [orders, splits] = await Promise.all([getAnalytics(30), getProfitSplits()]);
    return <AnalyticsClient orders={orders} splits={splits} />;
}
