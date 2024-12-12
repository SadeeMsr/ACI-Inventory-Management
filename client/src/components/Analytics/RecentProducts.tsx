import { Product } from '@/types';

interface RecentProductsProps {
  products: Product[];
}

export function RecentProducts({ products }: RecentProductsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
      <div className="space-y-3">
        {products.map(product => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p className="font-medium">{product.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.description}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              product.status === 'Completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : product.status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
            }`}>
              {product.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 