import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

export const productFilterVar = makeVar({
  search: '',
  category: '',
  status: ''
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          merge: false,
          read(existing, { args, toReference }) {
            const filters = productFilterVar();
            if (!existing) return existing;
            
            return existing.filter((product: any) => {
              const matchesSearch = !filters.search || 
                product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                product.material.toString().includes(filters.search) ||
                product.barcode.includes(filters.search);
              
              const matchesCategory = !filters.category || 
                product.category === filters.category;
              
              const matchesStatus = !filters.status || 
                product.status === filters.status;
              
              return matchesSearch && matchesCategory && matchesStatus;
            });
          }
        }
      }
    }
  }
});

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  cache
}); 