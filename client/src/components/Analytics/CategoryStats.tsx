interface CategoryStatsProps {
  data: Array<{ category: string; count: number }>;
}

export function CategoryStats({ data }: CategoryStatsProps) {
  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
      <div className="space-y-4">
        {data.map(({ category, count }) => (
          <div key={category}>
            <div className="flex justify-between text-sm mb-1">
              <span>{category}</span>
              <span>{count}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 