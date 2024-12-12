'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/graphql/queries';
import { ProductDetailsModal } from '../Product/ProductDetailsModal';
import { UPDATE_PRODUCT_CATEGORY } from '@/graphql/mutations';
import { GET_PRODUCTS, GET_ANALYTICS } from '@/graphql/queries';
import { calculateUpdatedCategoryStats } from '@/utils/cache-helpers';

interface Props {
  product: Product;
  provided: any;
}

interface ProductsData {
  products: Product[];
}

interface UpdateProductCategoryResponse {
  updateProductCategory: {
    id: string;
    category: string;
  };
}

export function ProductCard({ product, provided }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [updateCategory] = useMutation<UpdateProductCategoryResponse>(UPDATE_PRODUCT_CATEGORY, {
    optimisticResponse: ({ category }) => ({
      updateProductCategory: {
        __typename: 'Product',
        id: product.id,
        category
      }
    }),
    update: (cache, { data }) => {
      if (!data) return;

      const existingProducts = cache.readQuery<ProductsData>({ 
        query: GET_PRODUCTS,
        returnPartialData: true 
      });
      
      if (existingProducts?.products) {
        const updatedProducts = existingProducts.products.map((p: Product) =>
          p.id === data.updateProductCategory.id
            ? { ...p, category: data.updateProductCategory.category }
            : p
        );

        cache.writeQuery<ProductsData>({
          query: GET_PRODUCTS,
          data: { products: updatedProducts }
        });
      }

      const existingAnalytics = cache.readQuery({ 
        query: GET_ANALYTICS,
        returnPartialData: true 
      }) as { analytics?: { productsByCategory: Array<{ category: string; count: number }> } } | null;

      if (existingAnalytics?.analytics?.productsByCategory) {
        cache.writeQuery({
          query: GET_ANALYTICS,
          data: {
            analytics: {
              ...existingAnalytics.analytics,
              productsByCategory: calculateUpdatedCategoryStats(
                existingAnalytics.analytics.productsByCategory,
                product.category,
                data.updateProductCategory.category
              )
            }
          }
        });
      }
    }
  });

  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="font-medium mb-2">{product.description}</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Material: {product.material}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Category: {product.status}</p>
        </div>
      </div>

      <ProductDetailsModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categoriesData?.categories || []}
      />
    </>
  );
} 