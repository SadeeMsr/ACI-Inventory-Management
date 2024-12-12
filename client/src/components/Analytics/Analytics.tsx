'use client';

import { useQuery } from '@apollo/client';
import { GET_ANALYTICS } from '@/graphql/queries';
import { StatCard } from './StatCard';
import { CategoryStats } from './CategoryStats';
import { RecentProducts } from './RecentProducts';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { AnalyticsChart } from './AnalyticsChart';

export function Analytics() {
  const { data, loading, error } = useQuery(GET_ANALYTICS);

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Error loading analytics
        </h3>
        <p className="text-sm text-red-600 dark:text-red-300">
          {error.message}
        </p>
      </div>
    </div>
  );

  const { analytics } = data;

  return (
    <ErrorBoundary>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <StatCard
        title="Total Products"
        value={analytics.totalProducts}
        icon="📦"
      />
      <StatCard
        title="Total Categories"
        value={analytics.totalCategories}
        icon="📑"
      />
      <div className="col-span-1 md:col-span-2">
        <CategoryStats data={analytics.productsByCategory} />
      </div>
      <div className="col-span-1 md:col-span-2">
        <AnalyticsChart recentProducts={analytics.recentProducts} />
      </div>
      <div className="col-span-1 md:col-span-2">
        <RecentProducts products={analytics.recentProducts} />
      </div>
    </div>
  </ErrorBoundary>
  );
} 