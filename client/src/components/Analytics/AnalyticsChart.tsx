import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Product } from '@/types';

interface AnalyticsChartProps {
  recentProducts: Product[];
}

export function AnalyticsChart({ recentProducts }: AnalyticsChartProps) {
  const productsByDate = recentProducts.reduce((acc: any, product) => {
    const date = new Date(parseInt(product.createdAt)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = { date, count: 0 };
    }
    acc[date].count++;
    return acc;
  }, {});

  // Sort data by date
  const chartData = Object.values(productsByDate)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm h-[300px]">
      <h3 className="text-lg font-semibold mb-4">Product Addition Trend</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            stroke="#888888"
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
            allowDecimals={false}
            tickMargin={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none',
              borderRadius: '4px',
              color: '#fff' 
            }} 
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Line 
            type="monotone" 
            dataKey="count" 
            name="Products Added"
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 