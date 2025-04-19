
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  stock: number;
  featured?: boolean;
  discount?: number;
  colors?: string[];
  materials?: string[];
  modelFile?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Designer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export type FilterOptions = {
  category: string | null;
  priceRange: [number, number] | null;
  materials: string[] | null;
  colors: string[] | null;
  inStock: boolean | null;
};
