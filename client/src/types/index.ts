export interface Product {
  id: string;
  material: number;
  barcode: string;
  description: string;
  quantity: number;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface KanbanColumn {
  id: string;
  title: string;
  name?: string;
  products: Product[];
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
} 