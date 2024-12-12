import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $status: String) {
    products(category: $category, status: $status) {
      id
      material
      barcode
      description
      quantity
      category
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_BARCODE = gql`
  query GetProductByBarcode($barcode: String!) {
    productByBarcode(barcode: $barcode) {
      status
      product {
        id
        material
        barcode
        description
        quantity
        category
        status
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      productCount
    }
  }
`;

export const GET_ANALYTICS = gql`
  query GetAnalytics {
    analytics {
      productsByCategory {
        category
        count
      }
      recentProducts {
        id
        description
        category
        status
        createdAt
    }
      totalProducts
      totalCategories
    }
  }
`; 