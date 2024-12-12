import { useState, useEffect } from 'react';
import { useQuery, useMutation, ApolloCache } from '@apollo/client';
import { GET_CATEGORIES, GET_PRODUCTS, GET_ANALYTICS } from '@/graphql/queries';
import { UPDATE_PRODUCT_STATUS, DELETE_CATEGORY } from '@/graphql/mutations';
import { Category, KanbanColumn, Product } from '@/types';
import { toast } from 'react-hot-toast';

const buildInitialColumns = (categories: Category[]): KanbanColumn[] => [
  { id: 'uncategorized', title: 'Uncategorized', products: [] },
  ...categories.map((category) => ({
    id: category.id,
    title: category.name,
    name: category.name,
    products: []
  }))
];

const distributeProducts = (columns: KanbanColumn[], products: Product[]): KanbanColumn[] =>
  columns.map(column => ({
    ...column,
    products: products.filter(
      (product: Product) => 
        product.status.toLowerCase() === (column.name || column.title).toLowerCase()
    )
  }));

const isValidDrag = (result: any) => {
  const { destination, source } = result;
  return destination && 
    !(source.droppableId === destination.droppableId && 
      source.index === destination.index);
};

const updateColumnOrder = (
  columns: KanbanColumn[], 
  source: any, 
  destination: any
): KanbanColumn[] => {
  const sourceColumn = columns.find(col => col.id === source.droppableId);
  const destColumn = columns.find(col => col.id === destination.droppableId);

  if (!sourceColumn || !destColumn) return columns;

  const product = sourceColumn.products[source.index];
  
  return columns.map(col => {
    if (col.id === source.droppableId) {
      const newProducts = Array.from(col.products);
      newProducts.splice(source.index, 1);
      return { ...col, products: newProducts };
    }
    if (col.id === destination.droppableId) {
      const newProducts = Array.from(col.products);
      newProducts.splice(destination.index, 0, product);
      return { ...col, products: newProducts };
    }
    return col;
  });
};

const handleProductStatusUpdate = (cache: ApolloCache<any>, { data }: any) => {
  const existingProducts = cache.readQuery<{ products: Product[] }>({ 
    query: GET_PRODUCTS,
    returnPartialData: true 
  });

  if (!existingProducts?.products) return;

  const updatedProducts = existingProducts.products.map((product: Product) =>
    product.id === data.updateProductStatus.id
      ? { ...product, status: data.updateProductStatus.status }
      : product
  );

  cache.writeQuery({
    query: GET_PRODUCTS,
    data: { products: updatedProducts }
  });
};

const handleCategoryDelete = (cache: ApolloCache<any>, { data }: any) => {
  const existingCategories = cache.readQuery<{ categories: Category[] }>({
    query: GET_CATEGORIES
  });

  if (existingCategories) {
    cache.writeQuery({
      query: GET_CATEGORIES,
      data: {
        categories: existingCategories.categories.filter(
          cat => cat.id !== data.deleteCategory.id
        )
      }
    });
  }

  const existingProducts = cache.readQuery<{ products: Product[] }>({
    query: GET_PRODUCTS
  });

  if (existingProducts) {
    cache.writeQuery({
      query: GET_PRODUCTS,
      data: {
        products: existingProducts.products.map(product => 
          product.status === data.deleteCategory.name
            ? { ...product, status: 'Uncategorized' }
            : product
        )
      }
    });
  }

  const existingAnalytics = cache.readQuery<{ analytics: any }>({ query: GET_ANALYTICS });
  if (existingAnalytics?.analytics) {
    cache.writeQuery({
      query: GET_ANALYTICS,
      data: {
        analytics: {
          ...existingAnalytics.analytics,
          totalCategories: existingAnalytics.analytics.totalCategories - 1
        }
      }
    });
  }
};

export function useKanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (data?.products && categoriesData?.categories) {
      const dynamicColumns = buildInitialColumns(categoriesData.categories);
      const updatedColumns = distributeProducts(dynamicColumns, data.products);
      setColumns(updatedColumns);
    }
  }, [data, categoriesData]);

  const [updateProductStatus] = useMutation(UPDATE_PRODUCT_STATUS, {
    optimisticResponse: ({ productId, status }) => ({
      updateProductStatus: {
        __typename: 'Product',
        id: productId,
        status
      }
    }),
    update: handleProductStatusUpdate
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    update: handleCategoryDelete
  });

  const handleDragEnd = async (result: any) => {
    if (!isValidDrag(result)) return;

    const { destination, draggableId } = result;
    const destColumn = columns.find(col => col.id === destination.droppableId);
    if (!destColumn) return;

    const updatedColumns = updateColumnOrder(columns, result.source, destination);
    setColumns(updatedColumns);

    try {
      await updateProductStatus({
        variables: {
          productId: draggableId,
          status: destColumn.title
        }
      });
      toast.success('Product status updated');
    } catch (error) {
      toast.error('Failed to update product status');
      setColumns(columns);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory({
        variables: { id: categoryId }
      });
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return {
    columns,
    loading,
    error,
    handleDragEnd,
    handleDeleteCategory
  };
}