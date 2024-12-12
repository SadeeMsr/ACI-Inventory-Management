interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value+1}</p>
    </div>
  );
} 