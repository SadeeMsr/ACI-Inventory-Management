import { gql } from '@apollo/client';

export const ADD_PRODUCT = gql`
  mutation AddProduct($barcode: String!) {
    addProduct(barcode: $barcode) {
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

export const UPDATE_PRODUCT_STATUS = gql`
  mutation UpdateProductStatus($productId: ID!, $status: String!) {
    updateProductStatus(productId: $productId, status: $status) {
      id
      status
    }
  }
`;

export const UPDATE_PRODUCT_CATEGORY = gql`
  mutation UpdateProductCategory($productId: ID!, $category: String!) {
    updateProductCategory(productId: $productId, category: $category) {
      id
      category
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
      productCount
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`; 